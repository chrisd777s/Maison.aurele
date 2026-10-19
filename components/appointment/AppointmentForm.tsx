"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useCatalogueEntry } from "@/components/shop/ShopProvider";
import { Icon } from "@/components/ui/Icon";
import { maison } from "@/data/maison";
import { Link } from "@/i18n/navigation";
import { formatDayShort, formatSlot, formatTime } from "@/lib/appointment/format";
import { appointmentIcs } from "@/lib/appointment/ics";
import {
  OCCASIONS,
  appointmentSchema,
  type Appointment,
  type AppointmentInput,
} from "@/lib/appointment/schema";
import { PLACES, availableDays, type Place } from "@/lib/appointment/slots";
import { decodeConfig } from "@/lib/atelier/config";
import { formatNumber } from "@/lib/format";
import { zodResolver } from "@/lib/forms/zod-resolver";

type Step = 1 | 2 | 3;
const STEP_FIELDS: Record<Step, FieldPath<AppointmentInput>[]> = {
  1: ["place"],
  2: ["date", "time"],
  3: ["occasion", "firstName", "lastName", "email", "phone", "message", "consent"],
};
const ERROR_KEYS = ["required", "email", "phone", "tooLong", "consent", "chooseSlot"] as const;
type ErrorKey = (typeof ERROR_KEYS)[number];
const errorKey = (message?: string): ErrorKey =>
  (ERROR_KEYS as readonly string[]).includes(message ?? "") ? (message as ErrorKey) : "required";

type Done = { reference: string; data: Appointment };

const field =
  "min-h-12 w-full border border-filet bg-transparent px-4 text-corps placeholder:text-encre-douce aria-invalid:border-accent-encre";
const choice =
  "relative flex cursor-pointer border border-filet transition-colors duration-[var(--duree-courte)] ease-maison hover:border-encre-douce has-checked:border-encre has-checked:bg-surface has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-encre";

/**
 * Réservation du salon privé en trois temps : lieu, moment, intention.
 * Chaque étape est validée avant la suivante ; le serveur revalide tout.
 */
export function AppointmentForm({ piece, creation }: { piece?: string; creation?: string }) {
  const t = useTranslations("Appointment");
  const tm = useTranslations("Materials");
  const ta = useTranslations("Atelier");
  const locale = useLocale();
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState<Done | null>(null);
  const [serverError, setServerError] = useState<"slotTaken" | "mail" | "network" | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const ids = { first: useId(), last: useId(), email: useId(), phone: useId(), message: useId() };

  const pieceEntry = useCatalogueEntry(piece ?? "");
  const creationLine = useMemo(() => {
    if (!creation) return null;
    const c = decodeConfig(new URLSearchParams(creation));
    return ta("summaryLine", {
      shape: tm(`shapes.${c.shape}`),
      carats: formatNumber(c.carats, locale),
      setting: ta(`settings.${c.setting}`).toLocaleLowerCase(locale),
      metal: tm(`metals.${c.metal}`).toLocaleLowerCase(locale),
    });
  }, [creation, ta, tm, locale]);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput, unknown, Appointment>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      piece: pieceEntry ? piece : undefined,
      creation: creation || undefined,
      date: "",
      phone: "",
      message: "",
      website: "",
    },
    shouldFocusError: true,
  });

  const [place, date, time, occasion] = useWatch({
    control,
    name: ["place", "date", "time", "occasion"],
  });
  const days = useMemo(() => (place ? availableDays(place) : []), [place]);
  const day = days.find((d) => d.date === date);

  // Le titre de l'étape reçoit le focus : le lecteur d'écran annonce où l'on est.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, done]);

  // Une erreur affichée se met à jour dès que le champ change (pas seulement au clic suivant).
  const recheck = (...names: FieldPath<AppointmentInput>[]) => {
    const shown = names.filter((n) => errors[n as keyof typeof errors]);
    if (shown.length) void trigger(shown);
  };

  async function next() {
    if (await trigger(STEP_FIELDS[step])) setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  }

  async function submit(data: Appointment) {
    setServerError(null);
    try {
      const response = await fetch("/api/rendez-vous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json = (await response.json()) as { reference?: string; error?: string };
      if (response.status === 409) {
        setValue("time", undefined as unknown as Appointment["time"]);
        setServerError("slotTaken");
        setStep(2);
        return;
      }
      if (!response.ok || !json.reference) {
        setServerError(json.error === "mail" ? "mail" : "network");
        return;
      }
      setDone({ reference: json.reference, data });
    } catch {
      setServerError("network");
    }
  }

  const err = (name: keyof AppointmentInput) =>
    errors[name] ? t(`errors.${errorKey(errors[name]?.message)}`) : null;

  if (done) return <Confirmation done={done} headingRef={heading} pieceName={pieceEntry?.name} />;

  const stepTitle = { 1: t("step1"), 2: t("step2"), 3: t("step3") }[step];

  return (
    <div className="grille gap-y-12">
      {/* Récapitulatif (grand écran) */}
      <aside className="col-span-12 lg:col-span-4" aria-label={t("summaryLabel")}>
        <div className="lg:sticky lg:top-[calc(var(--entete)+2rem)]">
          <ol className="flex gap-6 border-b border-filet pb-4 lg:flex-col lg:gap-3 lg:border-0">
            {([1, 2, 3] as Step[]).map((s) => (
              <li
                key={s}
                aria-current={s === step ? "step" : undefined}
                className="surtitre flex items-baseline gap-2 text-encre-douce aria-[current]:text-encre"
              >
                <span className="chiffres text-chapeau normal-case">0{s}</span>
                <span className="max-sm:sr-only">
                  {{ 1: t("step1"), 2: t("step2"), 3: t("step3") }[s]}
                </span>
              </li>
            ))}
          </ol>
          <dl className="mt-8 hidden space-y-4 text-petit lg:block">
            <Summary label={t("summaryPlace")}>{place ? t(`places.${place}.name`) : "—"}</Summary>
            <Summary label={t("summaryWhen")}>
              {place && date && time ? formatSlot(date, time, locale) : "—"}
            </Summary>
            <Summary label={t("summaryOccasion")}>
              {occasion ? t(`occasions.${occasion}`) : "—"}
            </Summary>
            {pieceEntry && <Summary label={t("summaryPiece")}>{pieceEntry.name}</Summary>}
            {creationLine && <Summary label={t("summaryCreation")}>{creationLine}</Summary>}
          </dl>
          <p className="mt-10 hidden max-w-[36ch] text-petit text-encre-douce lg:block">
            {t("reassurance")}
          </p>
        </div>
      </aside>

      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="col-span-12 lg:col-span-7 lg:col-start-6"
        aria-labelledby="etape-titre"
      >
        <h2
          id="etape-titre"
          ref={heading}
          tabIndex={-1}
          className="font-display text-titre-2 font-light outline-none"
        >
          <span className="sr-only">{t("stepOf", { step, total: 3 })} </span>
          {stepTitle}
        </h2>

        {/* 1 · Lieu */}
        <fieldset hidden={step !== 1} className="mt-8">
          <legend className="sr-only">{t("step1")}</legend>
          <div className="grid gap-3 md:grid-cols-3">
            {PLACES.map((p) => (
              <label key={p} className={`${choice} flex-col gap-2 p-5`}>
                <input
                  type="radio"
                  value={p}
                  {...register("place", {
                    onChange: () => {
                      setValue("date", "");
                      setValue("time", undefined as unknown as Appointment["time"]);
                      recheck("place");
                    },
                  })}
                  className="sr-only"
                />
                <span className="font-display text-titre-3 leading-tight">
                  {t(`places.${p}.name`)}
                </span>
                <span className="text-petit text-encre-douce">
                  {p === "visio" ? t("places.visio.detail") : placeAddress(p)}
                </span>
                <span className="mt-auto pt-3 text-petit">{t(`places.${p}.hours`)}</span>
              </label>
            ))}
          </div>
          <FieldError message={err("place")} />
        </fieldset>

        {/* 2 · Moment */}
        <fieldset hidden={step !== 2} className="mt-8">
          <legend className="surtitre text-encre-douce">{t("chooseDay")}</legend>
          <div className="-mx-marge mt-4 overflow-x-auto px-marge pb-2 md:mx-0 md:px-0">
            <div className="flex gap-2 md:grid md:grid-cols-5">
              {days.map((d) => (
                <label
                  key={d.date}
                  className={`${choice} min-w-22 flex-col items-center px-2 py-3 text-center`}
                >
                  <input
                    type="radio"
                    value={d.date}
                    {...register("date", {
                      onChange: () => {
                        setValue("time", undefined as unknown as Appointment["time"]);
                        recheck("date");
                      },
                    })}
                    className="sr-only"
                  />
                  <span className="text-petit first-letter:uppercase">
                    {formatDayShort(d.date, locale)}
                  </span>
                  <span className="chiffres mt-1 text-[0.75rem] text-encre-douce">
                    {t("freeSlots", { count: d.slots.filter((s) => s.available).length })}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {day && (
            <fieldset className="mt-8">
              <legend className="surtitre text-encre-douce">
                {t("chooseTime", { day: formatDayShort(day.date, locale) })}
              </legend>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {day.slots.map((s) => (
                  <label
                    key={s.time}
                    className={`${choice} flex-col items-center py-3 has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:text-encre-douce`}
                  >
                    <input
                      type="radio"
                      value={s.time}
                      disabled={!s.available}
                      {...register("time", { onChange: () => recheck("date", "time") })}
                      className="sr-only"
                    />
                    <span className="chiffres text-corps">{formatTime(s.time, locale)}</span>
                    {!s.available && <span className="text-[0.75rem]">{t("full")}</span>}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-petit text-encre-douce">
                {t(place === "paris" ? "timezoneParis" : "timezoneMontreal")}
              </p>
            </fieldset>
          )}
          <FieldError
            message={
              serverError === "slotTaken" ? t("errors.slotTaken") : (err("date") ?? err("time"))
            }
          />
        </fieldset>

        {/* 3 · Intention et coordonnées */}
        <div hidden={step !== 3} className="mt-8 space-y-10">
          <fieldset>
            <legend className="surtitre text-encre-douce">{t("occasionLabel")}</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <label key={o} className={`${choice} min-h-11 items-center px-4 text-petit`}>
                  <input
                    type="radio"
                    value={o}
                    {...register("occasion", { onChange: () => recheck("occasion") })}
                    className="sr-only"
                  />
                  {t(`occasions.${o}`)}
                </label>
              ))}
            </div>
            <FieldError message={err("occasion")} />
          </fieldset>

          {(pieceEntry || creationLine) && (
            <div className="border-l border-accent pl-5">
              <p className="surtitre text-encre-douce">{t("interest")}</p>
              {pieceEntry && <p className="mt-2 font-display text-chapeau">{pieceEntry.name}</p>}
              {creationLine && (
                <p className="mt-2 font-display text-chapeau italic">{creationLine}</p>
              )}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <TextField id={ids.first} label={t("firstName")} error={err("firstName")}>
              <input
                id={ids.first}
                autoComplete="given-name"
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? `${ids.first}-err` : undefined}
                {...register("firstName")}
                className={field}
              />
            </TextField>
            <TextField id={ids.last} label={t("lastName")} error={err("lastName")}>
              <input
                id={ids.last}
                autoComplete="family-name"
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? `${ids.last}-err` : undefined}
                {...register("lastName")}
                className={field}
              />
            </TextField>
            <TextField id={ids.email} label={t("email")} error={err("email")}>
              <input
                id={ids.email}
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${ids.email}-err` : undefined}
                {...register("email")}
                className={field}
              />
            </TextField>
            <TextField
              id={ids.phone}
              label={t("phone")}
              error={err("phone")}
              optional={t("optional")}
            >
              <input
                id={ids.phone}
                type="tel"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${ids.phone}-err` : undefined}
                {...register("phone")}
                className={field}
              />
            </TextField>
            <div className="sm:col-span-2">
              <TextField
                id={ids.message}
                label={t("message")}
                error={err("message")}
                optional={t("optional")}
              >
                <textarea
                  id={ids.message}
                  rows={4}
                  placeholder={t("messagePlaceholder")}
                  aria-invalid={Boolean(errors.message)}
                  {...register("message")}
                  className={`${field} py-3`}
                />
              </TextField>
            </div>
          </div>

          {/* Champ piège : invisible et hors du parcours clavier. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Site web
              <input tabIndex={-1} autoComplete="off" {...register("website")} />
            </label>
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-petit">
              <input
                type="checkbox"
                aria-invalid={Boolean(errors.consent)}
                {...register("consent")}
                className="mt-1 size-4 shrink-0 accent-[var(--encre)]"
              />
              <span>
                {t.rich("consent", {
                  link: (chunks) => (
                    <Link href="/confidentialite" className="lien-fin">
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>
            <FieldError message={err("consent")} />
          </div>
        </div>

        <p role="alert" className="mt-6 min-h-6 text-petit text-accent-encre">
          {serverError === "mail"
            ? t("errors.mail")
            : serverError === "network"
              ? t("errors.network")
              : ""}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-filet pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="surtitre lien-fin min-h-11"
            >
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="surtitre inline-flex min-h-12 items-center gap-3 bg-encre px-8 text-fond transition-colors duration-[var(--duree-courte)] ease-maison hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))]"
            >
              {t("continue")}
              <Icon name="arrow" width={14} height={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="surtitre inline-flex min-h-12 items-center gap-3 bg-encre px-8 text-fond transition-colors duration-[var(--duree-courte)] ease-maison hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))] disabled:opacity-70"
            >
              {isSubmitting ? t("sending") : t("submit")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function placeAddress(place: Exclude<Place, "visio">) {
  const p = maison.places[place];
  return `${p.street}, ${p.district}`;
}

function Summary({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="surtitre text-encre-douce">{label}</dt>
      <dd className="mt-1 font-display text-chapeau first-letter:uppercase">{children}</dd>
    </div>
  );
}

function FieldError({ message, id }: { message: string | null; id?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-petit text-accent-encre">
      {message}
    </p>
  ) : null;
}

function TextField({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  optional?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-petit">
        {label}
        {optional && <span className="text-encre-douce">{optional}</span>}
      </label>
      {children}
      <FieldError message={error} id={`${id}-err`} />
    </div>
  );
}

function Confirmation({
  done,
  headingRef,
  pieceName,
}: {
  done: Done;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  pieceName?: string;
}) {
  const t = useTranslations("Appointment");
  const locale = useLocale();
  const { data, reference } = done;
  const when = formatSlot(data.date, data.time, locale);
  const location =
    data.place === "visio"
      ? t("places.visio.name")
      : `${placeAddress(data.place)}, ${maison.places[data.place].city}`;

  function downloadIcs() {
    const ics = appointmentIcs({
      reference,
      place: data.place,
      date: data.date,
      time: data.time,
      title: t("icsTitle"),
      location,
      description: [t("icsDescription", { reference }), pieceName].filter(Boolean).join("\n"),
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `${reference}.ics`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grille" data-testid="rendez-vous-confirme">
      <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
        <p className="surtitre text-accent-encre">{t("doneEyebrow")}</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-titre-1 font-light outline-none"
        >
          {t("doneTitle")}
        </h2>
        <p className="mt-6 text-chapeau">{t("doneText", { email: data.email })}</p>
        <dl className="mt-10 divide-y divide-filet border-y border-filet">
          {[
            [t("reference"), reference],
            [t("summaryWhen"), when],
            [t("summaryPlace"), `${t(`places.${data.place}.name`)} — ${location}`],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
              <dt className="surtitre text-encre-douce">{label}</dt>
              <dd className="font-display text-chapeau first-letter:uppercase sm:text-right">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={downloadIcs}
            className="surtitre inline-flex min-h-12 items-center gap-3 border border-encre/70 px-8 hover:border-encre"
          >
            {t("addToCalendar")}
          </button>
          <Link href="/" className="surtitre lien-fin">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

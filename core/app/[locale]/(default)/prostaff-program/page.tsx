import { Award, Camera, MapPin, ShieldCheck, Trophy } from 'lucide-react';
import { type Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DynamicForm } from '@/vibes/soul/form/dynamic-form';
import type { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { getRecaptchaSiteKey } from '~/lib/recaptcha';

import HeroImage from '../_images//Duck Lifestyle/instagram_CvucfnKOrOj.jpg';
import { submitContactForm } from '../webpages/[id]/contact/_actions/submit-contact-form';

import { getContactPageData } from '../contact/page-data';

export const metadata: Metadata = {
  title: 'Big Al’s Decoys Field Staff Program',
  description:
    'Join the Big Al’s Decoys Field Staff Program. Hunt hard, create authentic content, and earn rewards for your contribution.',
};

const PROGRAM_PATH = '/prostaff-program';

const fieldMapping = {
  fullname: 'fullName',
  companyname: 'companyName',
  phone: 'phone',
  orderno: 'orderNo',
  rma: 'rma',
} as const;

type ContactField = keyof typeof fieldMapping;

const programBenefits = [
  {
    Icon: Award,
    title: 'Earn More as You Contribute',
    copy: 'Your benefits grow with the quality of content you provide and the ways you collaborate with Big Al’s.',
  },
  {
    Icon: Camera,
    title: 'Create from the Field',
    copy: 'Share authentic photos and videos from your hunts for Big Al’s social, advertising, email, website, and more.',
  },
  {
    Icon: ShieldCheck,
    title: 'Unlock Field Staff Benefits',
    copy: 'Access deeper discounts, early product access, limited releases, field testing, and feature opportunities.',
  },
];

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string }>;
}

function toGroupsOfTwo(fields: Field[]) {
  return fields.reduce<Array<FieldGroup<Field>>>((groups, _, index) => {
    if (index % 2 === 0) {
      groups.push(fields.slice(index, index + 2));
    }

    return groups;
  }, []);
}

function buildApplicationFields(
  entityId: number,
  contactFields: string[],
  t: Awaited<ReturnType<typeof getTranslations<'WebPages.ContactUs.Form'>>>,
): Array<Field | FieldGroup<Field>> {
  const emailField: Field = {
    id: 'email',
    name: 'email',
    label: `${t('email')} *`,
    type: 'email',
    required: true,
  };
  const commentsField: Field = {
    id: 'comments',
    name: 'comments',
    label:
      'Tell us what you hunt, where you hunt, your Big Al’s experience, the content you can contribute, and why you want to join. *',
    type: 'textarea',
    required: true,
  };
  const optionalFields = contactFields
    .filter((field): field is ContactField => Object.hasOwn(fieldMapping, field))
    .map<Field>((field) => ({
      id: field,
      name: field,
      label: t(fieldMapping[field]),
      type: 'text',
      required: false,
    }));

  return [
    ...toGroupsOfTwo([emailField, ...optionalFields]),
    commentsField,
    {
      id: 'pageId',
      name: 'pageId',
      type: 'hidden',
      label: 'Page ID',
      defaultValue: String(entityId),
    },
    {
      id: 'pagePath',
      name: 'pagePath',
      type: 'hidden',
      label: 'Page Path',
      defaultValue: PROGRAM_PATH,
    },
  ];
}

export default async function ProStaffProgramPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { success } = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations('WebPages.ContactUs.Form');
  const [contactPage, recaptchaSiteKey] = await Promise.all([
    getContactPageData(PROGRAM_PATH),
    getRecaptchaSiteKey(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="relative min-h-[500px] w-full" style={{ height: '70vh' }}>
          <Image
            alt="Waterfowl hunters setting a decoy spread in the field"
            className="scale-x-[-1] object-cover"
            style={{ objectPosition: 'center right' }}
            fill
            placeholder="blur"
            preload
            sizes="100vw"
            src={HeroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-screen-xl px-4 pb-14 sm:px-6 lg:px-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                Big Al’s Decoys Field Staff Program
              </p>
              <h1 className="max-w-4xl font-display uppercase leading-[0.87] text-white [font-size:clamp(2.8rem,8vw,7rem)]">
                Hunt Hard.
                <br />
                Create. Get Rewarded.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-screen-xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              The More You Contribute, the More You Get Back
            </p>
            <h2 className="mt-5 font-display uppercase leading-[0.9] text-foreground [font-size:clamp(2rem,4vw,3.5rem)]">
              Built for hunters
              <br />
              who show up.
            </h2>
            <p className="mt-7 text-base leading-relaxed text-contrast-500">
              The Big Al’s Decoys Field Staff Program is built around a simple idea: the more you
              contribute, the more you get back. We are looking for waterfowl hunters who run Big
              Al’s in the field and can help show other hunters what our products can do.
            </p>
            <p className="mt-5 text-base leading-relaxed text-contrast-500">
              A major part of Field Staff is providing authentic photos and videos from your hunts.
              You do not need a massive following or professional camera equipment. We want real
              content from real hunters using Big Al’s.
            </p>
            <div className="mt-10 divide-y border-y border-contrast-100">
              {programBenefits.map(({ Icon, title, copy }) => (
                <div className="flex gap-4 py-5" key={title}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold uppercase text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-contrast-500">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-start gap-3 border-l-2 border-primary pl-4 text-sm leading-relaxed text-contrast-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <p>
                Your discount is not based on follower count. It is based on how much you
                contribute.
              </p>
            </div>
          </div>

          <div className="border border-contrast-100 bg-background p-6 sm:p-9">
            {success === 'true' ? (
              <div className="py-12 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  Application Received
                </p>
                <h2 className="mt-5 font-display text-3xl uppercase text-foreground">
                  Thanks for applying to Field Staff.
                </h2>
                <p className="mx-auto mt-5 max-w-md text-contrast-500">{t('success')}</p>
                <div className="mt-8">
                  <ButtonLink href="/shop" size="medium" variant="primary">
                    {t('successCta')}
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  Apply Now
                </p>
                <h2 className="mt-4 font-display text-3xl uppercase text-foreground">
                  Apply to Join the Team.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-contrast-500">
                  Tell us about yourself, how you hunt, and why you would be a good addition to Big
                  Al’s Pro-Staff. Every application is reviewed by our team.
                </p>
                {contactPage ? (
                  <div className="mt-8">
                    <DynamicForm
                      action={submitContactForm}
                      fields={buildApplicationFields(
                        contactPage.entityId,
                        contactPage.contactFields,
                        t,
                      )}
                      recaptchaSiteKey={recaptchaSiteKey}
                      submitLabel="Submit Application"
                    />
                    <div className="mt-6 border-l-2 border-primary pl-4 text-xs leading-relaxed text-contrast-500">
                      <p className="font-bold uppercase tracking-wider text-foreground">
                        Content Agreement
                      </p>
                      <p className="mt-2">
                        By submitting this application and participating in the Big Al’s Decoys
                        Pro-Staff Program, you acknowledge that photos, videos, and other content
                        you voluntarily submit may be used by Big Al’s Decoys for marketing and
                        promotional purposes without additional compensation. You represent that you
                        have the right to submit that content and grant Big Al’s Decoys permission
                        to use, reproduce, edit, publish, and distribute it.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-8 border-l-2 border-primary pl-4 text-sm text-contrast-500">
                    The application form is being prepared. Please check back shortly.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-ink text-background">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-20">
          <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
            <Trophy className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              The Top Two Are Going Hunting
            </p>
            <h2 className="mt-5 font-display uppercase leading-[0.9] text-white [font-size:clamp(2rem,4vw,3.5rem)]">
              Put in the work.
              <br />
              Earn your spot.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-contrast-200">
              At the end of each season, the two top-producing Big Al’s Field Staff members will be
              invited on a guided waterfowl hunt. We will look at the quality and quantity of
              content submitted throughout the season, participation in collaborative social posts,
              and overall contribution to Big Al’s.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-contrast-200">
              Capture a spread before shooting light, birds working the decoys, a quick video
              explaining how you run your spread, product footage, or the behind-the-scenes moments
              that tell the Big Al’s story. Members who consistently contribute quality content and
              work with us receive the greatest benefits.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import type { APIKeyAuthentication, Provider } from "@trigger.dev/providers";
import { marked } from "marked";
import { Fragment, useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../primitives/Buttons";
import { StyledDialog } from "../primitives/Dialog";
import { FormError } from "../primitives/FormError";
import { Input } from "../primitives/Input";
import { InputGroup } from "../primitives/InputGroup";
import { Label } from "../primitives/Label";
import type { Response as CreateResponse } from "~/routes/resources/connection";
import { useTypedFetcher } from "remix-typedjson";
import { Body } from "../primitives/text/Body";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

type Status = "loading" | "idle";

export function AddApiKeyButton({
  integration,
  authentication,
  organizationId,
  sourceId,
  serviceId,
  className,
  children,
}: {
  integration: Provider;
  authentication: APIKeyAuthentication;
  organizationId: string;
  sourceId?: string;
  serviceId?: string;
  className?: string;
  children: (status: Status) => React.ReactNode;
}) {
  const fetcher = useTypedFetcher<CreateResponse>();
  const [isOpen, setIsOpen] = useState(false);

  const errors =
    fetcher.type === "done" && !fetcher.data.success
      ? fetcher.data.errors
      : undefined;

  useEffect(() => {
    if (
      fetcher.type === "done" &&
      fetcher.state === "idle" &&
      fetcher.data?.success === true
    ) {
      setIsOpen(false);
    }
  }, [fetcher.type, fetcher.state, fetcher.data]);

  return (
    <>
      <button onClick={(e) => setIsOpen(true)} className={className}>
        {children(fetcher.state === "idle" ? "idle" : "loading")}
      </button>

      <StyledDialog.Dialog
        onClose={(e) => setIsOpen(false)}
        appear
        show={isOpen}
        as={Fragment}
      >
        <StyledDialog.Panel>
          <StyledDialog.Title>
            Add your {integration.name} API keys
          </StyledDialog.Title>
          <div className="overflow-hidden overflow-y-auto max-h-40 mb-3 mt-4 bg-slate-700/50 rounded px-4 pb-3 pt-4">
            <div className="flex gap-0.5 items-center -m-0.5 mb-1 text-slate-400">
              <InformationCircleIcon className="h-5 w-5" />
              <Body size="small" className="uppercase tracking-wide">
                Instructions
              </Body>
            </div>
            <p
              className="prose prose-sm prose-invert"
              dangerouslySetInnerHTML={{
                __html: marked(authentication.documentation),
              }}
            />
          </div>

          <fetcher.Form method="post" action="/resources/connection?index">
            <input type="hidden" name="type" value="api_key" />
            <input type="hidden" name="organizationId" value={organizationId} />
            <input type="hidden" name="service" value={integration.slug} />
            {sourceId && (
              <input type="hidden" name="sourceId" value={sourceId} />
            )}
            {serviceId && (
              <input type="hidden" name="serviceId" value={serviceId} />
            )}
            <InputGroup>
              <Label htmlFor="title">Name</Label>
              <div className="flex">
                <img
                  src={integration.icon}
                  alt={integration.icon}
                  className="flex pointer-events-none z-10 -mr-7 ml-2.5 mt-2.5 w-5 h-5"
                />
                <Input
                  id="title"
                  name="title"
                  placeholder="Name this integration"
                  spellCheck={false}
                  defaultValue={integration.name}
                  className="pl-9"
                />
              </div>
              {errors && <FormError errors={errors} path={["title"]} />}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                name="api_key"
                placeholder="<api_key>"
                spellCheck={false}
                type="password"
              />
              {errors && <FormError errors={errors} path={["api_key"]} />}
            </InputGroup>

            {authentication.additionalFields?.map((field) => {
              const fieldName = `additionalFields[${field.key}]`;
              return (
                <InputGroup key={field.key}>
                  <Label htmlFor={fieldName}>{field.name}</Label>
                  <Input
                    id={fieldName}
                    name={fieldName}
                    placeholder={field.placeholder}
                    spellCheck={false}
                  />
                  {errors && (
                    <FormError
                      errors={errors}
                      path={["additionalFields", field.key]}
                    />
                  )}
                </InputGroup>
              );
            })}

            <div className="mt-4 flex justify-between">
              <SecondaryButton type="button" onClick={(e) => setIsOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit">Save</PrimaryButton>
            </div>
          </fetcher.Form>
        </StyledDialog.Panel>
      </StyledDialog.Dialog>
    </>
  );
}

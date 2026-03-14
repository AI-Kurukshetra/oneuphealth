"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type EndpointDefinition = {
  id: string;
  label: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  requiresId?: boolean;
  sampleId?: string;
  bodyTemplate?: string;
};

type ResponseState = {
  ok: boolean;
  status: number;
  body: string;
};

const endpointDefinitions: EndpointDefinition[] = [
  {
    id: "catalog",
    label: "FHIR Catalog",
    method: "GET",
    path: "/api/fhir",
    description: "Lists the resource types exposed by this platform.",
  },
  {
    id: "patient-get",
    label: "Get Patient by FHIR ID",
    method: "GET",
    path: "/api/fhir/Patient/:id",
    description: "Fetches a stored canonical Patient resource by its FHIR resource id.",
    requiresId: true,
    sampleId: "patient-resource-id",
  },
  {
    id: "patient-create",
    label: "Create Patient",
    method: "POST",
    path: "/api/fhir/Patient",
    description: "Creates a canonical Patient resource and syncs the operational patient record.",
    bodyTemplate: JSON.stringify(
      {
        resourceType: "Patient",
        identifier: [{ system: "urn:mrn", value: "MRN-1001" }],
        name: [{ family: "Doe", given: ["Jamie"] }],
        gender: "female",
        birthDate: "1990-05-12",
        telecom: [
          { system: "email", value: "jamie.doe@example.com", use: "home" },
          { system: "phone", value: "+1-555-0100", use: "mobile" },
        ],
      },
      null,
      2,
    ),
  },
  {
    id: "observation-list",
    label: "List Observations",
    method: "GET",
    path: "/api/fhir/Observation",
    description: "Lists Observation resources available in the current organization.",
  },
  {
    id: "observation-create",
    label: "Create Observation",
    method: "POST",
    path: "/api/fhir/Observation",
    description: "Creates a canonical Observation and syncs the operational observation row.",
    bodyTemplate: JSON.stringify(
      {
        resourceType: "Observation",
        status: "final",
        code: {
          coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }],
          text: "Heart rate",
        },
        subject: { reference: "Patient/patient-resource-id" },
        effectiveDateTime: "2026-03-14T09:30:00Z",
        valueQuantity: { value: 72, unit: "beats/minute" },
      },
      null,
      2,
    ),
  },
  {
    id: "encounter-list",
    label: "List Encounters",
    method: "GET",
    path: "/api/fhir/Encounter",
    description: "Lists Encounter resources for the current organization.",
  },
  {
    id: "encounter-create",
    label: "Create Encounter",
    method: "POST",
    path: "/api/fhir/Encounter",
    description: "Creates a canonical Encounter and syncs the operational encounter row.",
    bodyTemplate: JSON.stringify(
      {
        resourceType: "Encounter",
        status: "finished",
        class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "AMB" },
        subject: { reference: "Patient/patient-resource-id" },
        period: { start: "2026-03-14T08:00:00Z", end: "2026-03-14T08:30:00Z" },
      },
      null,
      2,
    ),
  },
];

export function FhirEndpointTester() {
  const [selectedId, setSelectedId] = useState(endpointDefinitions[0].id);
  const [resourceId, setResourceId] = useState(endpointDefinitions[1].sampleId ?? "");
  const [requestBody, setRequestBody] = useState(endpointDefinitions[2].bodyTemplate ?? "");
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedEndpoint = useMemo(
    () => endpointDefinitions.find((endpoint) => endpoint.id === selectedId) ?? endpointDefinitions[0],
    [selectedId],
  );

  useEffect(() => {
    setErrorMessage(null);
    setResponse(null);
    if (selectedEndpoint.requiresId) {
      setResourceId(selectedEndpoint.sampleId ?? "");
    }
    setRequestBody(selectedEndpoint.bodyTemplate ?? "");
  }, [selectedEndpoint]);

  const resolvedPath = selectedEndpoint.requiresId
    ? selectedEndpoint.path.replace(":id", resourceId.trim())
    : selectedEndpoint.path;

  function handleSubmit() {
    startTransition(async () => {
      setErrorMessage(null);
      setResponse(null);

      if (selectedEndpoint.requiresId && !resourceId.trim()) {
        setErrorMessage("Enter a FHIR Patient resource id before sending the request.");
        return;
      }

      const init: RequestInit = {
        method: selectedEndpoint.method,
        headers: {},
      };

      if (selectedEndpoint.method === "POST") {
        try {
          JSON.parse(requestBody);
        } catch {
          setErrorMessage("Request body must be valid JSON.");
          return;
        }

        init.headers = { "Content-Type": "application/json" };
        init.body = requestBody;
      }

      try {
        const result = await fetch(resolvedPath, init);
        const raw = await result.text();
        let formatted = raw;

        try {
          formatted = JSON.stringify(JSON.parse(raw), null, 2);
        } catch {
          formatted = raw;
        }

        setResponse({ ok: result.ok, status: result.status, body: formatted || "<empty response>" });
      } catch {
        setErrorMessage("Request failed before the API returned a response.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-ink">FHIR Endpoint Tester</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Execute the platform&apos;s live FHIR routes from the signed-in session and inspect the raw response.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-3xl border border-line bg-slate-50/80 p-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="fhir-endpoint">
              Endpoint
            </label>
            <select
              id="fhir-endpoint"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink"
            >
              {endpointDefinitions.map((endpoint) => (
                <option key={endpoint.id} value={endpoint.id}>
                  {endpoint.method} {endpoint.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-line bg-white px-4 py-4">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span>{selectedEndpoint.method}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] tracking-[0.16em] text-slate-600">
                Live Request
              </span>
            </div>
            <p className="mt-3 break-all font-mono text-sm text-ink">{resolvedPath}</p>
            <p className="mt-3 text-sm leading-6 text-slate-500">{selectedEndpoint.description}</p>
          </div>

          {selectedEndpoint.requiresId ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="resource-id">
                FHIR Resource ID
              </label>
              <input
                id="resource-id"
                value={resourceId}
                onChange={(event) => setResourceId(event.target.value)}
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink"
                placeholder="patient-resource-id"
              />
            </div>
          ) : null}

          {selectedEndpoint.method === "POST" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink" htmlFor="request-body">
                JSON Body
              </label>
              <textarea
                id="request-body"
                value={requestBody}
                onChange={(event) => setRequestBody(event.target.value)}
                className="min-h-72 w-full rounded-2xl border border-line bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100"
                spellCheck={false}
              />
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Sending..." : "Send Request"}
          </button>
        </div>

        <div className="rounded-3xl border border-line bg-slate-950 p-5 text-slate-100">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Response Inspector
            </h4>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                response
                  ? response.ok
                    ? "bg-emerald-400/15 text-emerald-200"
                    : "bg-rose-400/15 text-rose-200"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {response ? `HTTP ${response.status}` : "Awaiting request"}
            </span>
          </div>
          <pre className="mt-5 min-h-96 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-100">
            {response?.body ?? "Choose an endpoint, send a request, and inspect the JSON response here."}
          </pre>
        </div>
      </div>
    </div>
  );
}

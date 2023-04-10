import { NextApiRequest, NextApiResponse } from "next";
import uuid from "short-uuid";
import { Verifier } from "./Verifier";
import {
  DefinitionIds,
  getPresentationDefinition,
} from "./presentationDefinitions";
import { uriWithBase } from "./utils";

const verifier = new Verifier(DefinitionIds.ENTRA_VERIFIED_ID_AND_SPHEREON);

export async function handleAuthRequestURI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ... implementation of the /webapp/definitions/:definitionId/auth-request-uri route logic
}

export async function handleAuthStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ... implementation of the /webapp/auth-status route logic
}

export async function handleDeleteAuthRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ... implementation of the /webapp/definitions/:definitionId/auth-requests/:correlationId route logic
}

export async function handleExtAuthRequests(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ... implementation of the /ext/definitions/:definitionId/auth-requests/:correlationId route logic
}

export async function handleExtAuthResponses(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ... implementation of the /ext/definitions/:definitionId/auth-responses/:correlationId route logic
}

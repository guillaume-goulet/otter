import { EntityState } from '@ngrx/entity';
import { AsyncStoreItem } from '@o3r/core';

/**
 * Variable model from the placeholder reply
 */
export interface PlaceholderVariable {
  type: 'fact' | 'fullUrl' | 'relativeUrl' | 'localisation';
  value: string;
  vars?: string[];
  path?: string;
}

/**
 * Raw JSON template coming back from the CMS or any other source
 */
export interface PlaceholderRequestReply {
  template?: string;
  vars?: Record<string, PlaceholderVariable>;
}

/**
 * PlaceholderRequest model
 */
export interface PlaceholderRequestModel extends AsyncStoreItem, PlaceholderRequestReply {
  /** Raw URL that is not localized, ex: my_url/[LANG]/my_placeholder.json */
  id: string;
  /** Resolved URL that is localized, ex: [LANG] my_url/en-GB/my_placeholder.json  */
  resolvedUrl: string;
  /** Rendered template associated to the resolved URL, can be dynamic */
  renderedTemplate?: string;
  /** Unknown type found in the reply */
  unknownTypeFound?: boolean;

  /** Caching mechanism will keep previous requests result for a given language, this boolean disables the dynamic rendering is turned to false */
  used?: boolean;
}

/**
 * PlaceholderRequest state details
 */
export interface PlaceholderRequestStateDetails extends AsyncStoreItem {}

/**
 * PlaceholderRequest store state
 */
export interface PlaceholderRequestState extends EntityState<PlaceholderRequestModel>, PlaceholderRequestStateDetails {
}

/**
 * Name of the PlaceholderRequest Store
 */
export const PLACEHOLDER_REQUEST_STORE_NAME = 'placeholderRequest';

/**
 * PlaceholderRequest Store Interface
 */
export interface PlaceholderRequestStore {
  /** PlaceholderRequest state */
  [PLACEHOLDER_REQUEST_STORE_NAME]: PlaceholderRequestState;
}

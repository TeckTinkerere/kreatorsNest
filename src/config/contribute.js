/**
 * Peer contribution configuration.
 *
 * KreatorNest is meant to be built by the community it serves, not curated by
 * one person. There are two ways in, and both avoid GitHub entirely:
 *
 *   1. Suggest — anyone submits a resource through a Google Form. Responses
 *      land in a `submissions` tab of the content sheet for review.
 *   2. Curate — trusted peers get Editor access to the sheet itself and their
 *      rows go live directly.
 *
 * See docs/CONTRIBUTING-PEERS.md for the setup.
 */

/** Google Form URL for resource suggestions. Empty hides every entry point. */
export const SUGGEST_FORM_URL = (process.env.REACT_APP_SUGGEST_FORM_URL || '').trim();

/**
 * Whether the suggest-a-resource flow is configured for this build.
 *
 * @returns {boolean}
 */
export function isSuggestEnabled() {
  return SUGGEST_FORM_URL !== '';
}

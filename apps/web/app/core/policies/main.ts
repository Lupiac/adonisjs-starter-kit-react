/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  // User policies
  UserPolicy: () => import('#users/policies/user_policy'),
  ImpersonatePolicy: () => import('#users/policies/impersonate_policy'),
  TokenPolicy: () => import('#users/policies/token_policy'),
}

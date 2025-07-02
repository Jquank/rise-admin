import type * as AppType from './modules/App.ts'
import { AppApi } from './modules/App.ts'
export type { AppType }
export { AppApi }

import type * as UserType from './modules/user.ts'
import { userApi } from './modules/user.ts'
export type { UserType }
export { userApi }

import type * as RoleType from './modules/role.ts'
import { roleApi } from './modules/role.ts'
export type { RoleType }
export { roleApi }

import type * as BoardType from './modules/board.ts'
import { boardApi } from './modules/board.ts'
export type { BoardType }
export { boardApi }

import type * as AuthType from './modules/auth.ts'
import { authApi } from './modules/auth.ts'
export type { AuthType }
export { authApi }

import type * as HouseType from './modules/house.ts'
import { houseApi } from './modules/house.ts'
export type { HouseType }
export { houseApi }

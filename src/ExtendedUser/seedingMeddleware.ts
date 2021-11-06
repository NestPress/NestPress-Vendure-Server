import { Role, User } from "@vendure/core";
import { NestMiddleware, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { Profile, CUSTOM_ROLES } from "./profile";

@Injectable()
export class SeedingMiddleware implements NestMiddleware {
  // to avoid roundtrips to db we store the info about whether
  // the seeding has been completed as boolean flag in the middleware
  // we use a promise to avoid concurrency cases. Concurrency cases may
  // occur if other requests also trigger a seeding while it has already
  // been started by the first request. The promise can be used by other
  // requests to wait for the seeding to finish.
  // eslint-disable-next-line
  // @ts-ignore
  private isSeedingComplete: Promise<boolean>;

  constructor(private readonly entityManager: EntityManager) {}

  async use(req: Request, res: Response, next: Function) {
    if (await this.isSeedingComplete) {
      // seeding has already taken place,
      // we can short-circuit to the next middleware
      return next();
    }

    this.isSeedingComplete = (async () => {
      if (
        !(await this.entityManager.findOne(Role, {
          where: { code: CUSTOM_ROLES.ADMIN.code },
        }))
      ) {
        await this.entityManager.transaction(
          async (transactionalEntityManager) => {
            await transactionalEntityManager.save(
              Role,
              Object.values(CUSTOM_ROLES)
            );
          }
        );
      }

      const profileToSave = { 
        user: { 
          id: "1",
        } 
      };
      if (
        !(await this.entityManager.findOne(Profile, { where: profileToSave }))
      ) {
        await this.entityManager.transaction(
          async (transactionalEntityManager) => {
            const adminRole = await transactionalEntityManager.findOne(Role, {
              where: { code: CUSTOM_ROLES.ADMIN.code },
            });
            await transactionalEntityManager.save(User, {
              id: 1,
              roles: [
                { id: 1 }, 
                { id: adminRole?.id }
              ],
            });

            await transactionalEntityManager.save(Profile, profileToSave);
          }
        );
      }

      return true;
    })();

    await this.isSeedingComplete;

    next();
  }
}

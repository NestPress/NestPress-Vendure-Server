import { Injectable } from "@nestjs/common";
import { RequestContext, TransactionalConnection } from "@vendure/core";
import { listWithItems } from "../advancedQuery";
import { PhysicalAddress } from "./entity";

export interface CreateAddressPayloadDto {
    street: string;
}

@Injectable()
export class AddressService {
    constructor(
        private connection: TransactionalConnection,
    ) {}

    getAll(ctx: RequestContext) {
        const addressRepo = this.connection.getRepository(ctx, PhysicalAddress);
        return addressRepo.findAndCount().then(listWithItems);
    }

    async createAddress(
        ctx: RequestContext,
        payload: CreateAddressPayloadDto
      ): Promise<PhysicalAddress | undefined> {
        const repository = this.connection.getRepository(ctx, PhysicalAddress);
        const newlyCreatedAddress = repository.create(payload);
        await repository.save(newlyCreatedAddress);
        return newlyCreatedAddress;
    }
}

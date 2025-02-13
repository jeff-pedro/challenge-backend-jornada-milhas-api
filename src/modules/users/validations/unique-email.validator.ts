import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) {}
    
    async validate(email: string): Promise<boolean> {
        try {
            const user = await this.usersService.findByEmail(email);
            return !user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                return true;
            }
            throw error;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'Email $value already exists. Choose another email.';
    }
}

export const IsUniqueEmail = (validationOptions?: ValidationOptions) => {
    return (object: Object, property: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: property,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueEmailConstraint
        });
    }
}
import { registerDecorator, ValidationOptions } from 'class-validator';

export function EnumArrayOf(_enum: any = {}, validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         name: 'EnumArrayOf',
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         validator: {
         validate(value: any = []) {
            const enumValues = Object.values(_enum)
            return value.every(el => enumValues.includes(el))
         },
         },
      })
   }
}
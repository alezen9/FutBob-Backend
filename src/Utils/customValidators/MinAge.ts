import { registerDecorator, ValidationOptions } from 'class-validator';
import dayjs from 'dayjs'

export function MinAge(age: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'MinAge',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
           const constraint = dayjs().subtract(age, 'year')
          return dayjs(value).isValid()
            ? dayjs(value).isBefore(constraint)
            : false
        },
      },
    })
  }
}
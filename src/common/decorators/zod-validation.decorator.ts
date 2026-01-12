import { ZodSchema } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";

/**
 * Alternative decorator approach (not recommended)
 * Use @UsePipes(new ZodValidationPipe(Schema)) instead
 */
export function UseZodValidation(schema: ZodSchema) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const pipe = new ZodValidationPipe(schema);

    descriptor.value = async function (...args: any[]) {
      // Validate the body (first argument is usually the body)
      const body = args[0];
      const validatedBody = pipe.transform(body, {
        type: "body",
        data: undefined,
        metatype: undefined,
      });
      args[0] = validatedBody;
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

type ValidationRule<T> = {
    field: keyof T;
    validate: (value: T[keyof T]) => boolean;
    message: string;
}

export function validateForm<T extends Record<string, any>>(
    data: T,
    rules: ValidationRule<T>[]
): {valid: boolean; errors: Partial<Record<keyof T, string>>}{
    const errors : Partial<Record<keyof T, string>> = {};

    for (const rule of rules){
        if(!rule.validate(data[rule.field])){
            errors[rule.field] = rule.message;
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}
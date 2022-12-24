import { validate } from "validate.js";

export const validateLength = (id, value, minLength, maxLength, allowEmpty) => {
    const constraints = {
        presence: { allowEmpty },
    };
    if (!allowEmpty || value !== "") {
        constraints.length = {}

        if (minLength != null) {
            constraints.length.minimum = minLength;
        }
        if (maxLength != null) {
            constraints.length.maximum = maxLength;
        }
    }

    const validateResult = validate({ [id]: value }, { [id]: constraints });
    return validateResult && validateResult[id];

}

export const validateString = (id, value) => {
    const constraints = {
        presence: { allowEmpty: false },
    };
    if (value !== "") {
        constraints.format = {
            pattern: "[a-z]+",
            flags: "i",
            message: "value can only contain letters"
        }
    }

    const validateResult = validate({ [id]: value }, { [id]: constraints });
    return validateResult && validateResult[id];

}

export const validateEmail = (id, value) => {
    const constraints = {
        presence: { allowEmpty: false },
    };
    if (value !== "") {
        constraints.email = true
    }

    const validateResult = validate({ [id]: value }, { [id]: constraints });
    return validateResult && validateResult[id];

}

export const validatePassword = (id, value) => {
    const constraints = {
        presence: { allowEmpty: false },
    };
    if (value !== "") {
        constraints.length = {
            minimum: 7,
            message: "must be at least 7 charaters"
        }
    }

    const validateResult = validate({ [id]: value }, { [id]: constraints });
    return validateResult && validateResult[id];

}
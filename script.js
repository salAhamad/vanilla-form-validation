'use strict';

const validateForm = formValidator => {
    const formElement = document.querySelector(formValidator)

    const validationOptions = [
        {
            attribute: 'minlength',
            isValid: input => input.value && input.value.length >= parseInt(input.minLength, 10),
            errorMessage: (input, label) => `${label.textContent} needs to be at least ${input.minLength} characters`
        },
        {
            attribute: 'custommaxlength',
            isValid: input => input.value && input.value.length <= parseInt(input.getAttribute('custommaxlength'), 10),
            errorMessage: (input, label) => `${label.textContent} cannot be more than ${input.getAttribute('custommaxlength')} characters`
        },
        {
            attribute: 'match',
            isValid: input => {
                const matchSelector = input.getAttribute('match')
                const matchedElement = formElement.querySelector(`#${matchSelector}`)
                return matchedElement && matchedElement.value.trim() === input.value.trim();
            },
            errorMessage: (input, label) => `${label.textContent} does not match`
        },
        {
            attribute: 'pattern',
            isValid: input => {
                const patternRegex = new RegExp(input.pattern)
                return patternRegex.test(input.value)
            },
            errorMessage: (input, label) => `Not a valid ${label.textContent}`
        },
        {
            attribute: 'required',
            isValid: input => input.value.trim() !== '',
            errorMessage: (input, label) => `${label.textContent} is required`
        },
    ]
    
    const validateSingleFormGroup = formGroup => {
        const input = formGroup.querySelector('input');
        const label = formGroup.querySelector('label');
        const error = formGroup.querySelector('.error');

        let formGroupError = false;

        for(const option of validationOptions) {
            if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
                formGroupError = true;
                input.classList.remove('is-valide')
                input.classList.add('is-invalid')
                
                error.classList.remove('d-none')
                error.textContent = option.errorMessage(input, label);
            }
        }
        if(!formGroupError) {
            input.classList.remove('is-invalid')
            input.classList.add('is-valid');
            error.classList.add('d-none');
        }
    }

    // Removing default HTML validation
    formElement.setAttribute('noValidate', '');
    
    Array.from(formElement.elements).forEach(element => {
        element.addEventListener('blur', (event) => {
            validateSingleFormGroup(event.target.parentElement)
        })
    })
    
    formElement.addEventListener('submit', event => {
        event.preventDefault();
        validateAllFromGroups(formElement)
    })

    const validateAllFromGroups = formToValidate => {
        const formGroups = Array.from(formElement.querySelectorAll('.form-group'))
        formGroups.forEach(group => {
            validateSingleFormGroup(group)
        })
    }

}
validateForm('#signUpForm');
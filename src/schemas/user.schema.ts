import { object, string, ref } from 'yup';

export const createUserSchema = object({
  body: object({
    username: string().required('Username is required'),
    name: string().required('Full name is required'),
    affiliation: string().required('Affiliation is required'),
    password: string().required('Password is required').min(6, 'Password is too short - should be 6 chars minimum.'),
    passwordConfirmation: string().oneOf([ref('password'), null], 'Passwords must match'),
  }),
});

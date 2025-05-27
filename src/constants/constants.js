import fs from 'fs';
import path from 'path';


export const VERIFY_EMAIL_TEMPLATE = fs.readFileSync(
    path.resolve('src/templates/verify-email.hbs'),
    'utf-8'
);
  
export const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
    path.resolve('src/templates/reset-password.hbs'),
    'utf-8'
);

export const PASSWORD_CHANGED_TEMPLATE = fs.readFileSync(
    path.resolve('src/templates/password-changed.hbs'),
    'utf-8'
);

export const ORDER_NOTIFICATION_TEMPLATE = fs.readFileSync(
    path.resolve('src/templates/new-order.hbs'),
    'utf-8'
);

export const EMAIL_SUBJECTS = {
    resetPassword: 'Reset your password',
    passwordChanged: 'Your password has been changed',
    orderNotification: 'You have a new order',
    verifyEmail: 'Please verify your email'
};

export const ALLOWED_CATEGORIES = ['electronics', 'clothing', 'books', 'toys', 'home', 'beauty'];
import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import path from "path";

/* PLUGINS */
import { NestPress } from "./NestPress";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const webAppUrl = process.env.WEB_APP_URL || "http://localhost:3000";

const emailFromAddress = (process.env.EMAIL_FROM_ADDRESS =
  '"example" <noreply@example.com>');

const isDevelopment = process.env.NODE_ENV !== 'production';

const transport = isDevelopment ? undefined : {
  type: process.env.EMAIL_TYPE,
  host: process.env.MAILGUN_SMTP_SERVER,
  port: process.env.MAILGUN_SMTP_PORT,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD
  }
};

export const config: VendureConfig = {
  apiOptions: {
    port,
    adminApiPath: "admin-api",
    adminApiPlayground: {
      settings: {
        "request.credentials": "include",
      } as any,
    }, // turn this off for production
    adminApiDebug: true, // turn this off for production
    shopApiPath: "shop-api",
    shopApiPlayground: {
      settings: {
        "request.credentials": "include",
      } as any,
    }, // turn this off for production
    shopApiDebug: true, // turn this off for production
  },
  authOptions: {
    superadminCredentials: {
      identifier: "superadmin",
      password: "superadmin",
    },
    tokenMethod: "cookie",
  },
  dbConnectionOptions: isDevelopment ? {
    type: "postgres",
    synchronize: true, // turn this off for production
    logging: false,
    database: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    migrations: [path.join(__dirname, "../migrations/*.ts")],
  } : {
    type: 'postgres',
    synchronize: true,
    url: process.env.DATABASE_URL,
    migrations: [path.join(__dirname, "../migrations/*.ts")],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  plugins: [
    NestPress,
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
    }),
    AdminUiPlugin.init({
      port,
      route: "/admin",
    }),
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    EmailPlugin.init({
      devMode: isDevelopment as true,
      transport: transport as any,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation
        fromAddress: emailFromAddress,
        verifyEmailAddressUrl: `${webAppUrl}/verify`,
        passwordResetUrl: `${webAppUrl}/password-reset`,
        changeEmailAddressUrl: `${webAppUrl}/verify-email-address-change`,
      },
    }),
  ],
};

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { Injectable } from '@nestjs/common'
import * as SibApiV3Sdk from '@getbrevo/brevo'
import * as hbs from 'handlebars'

@Injectable()
export class EmailService {
  private brevo: SibApiV3Sdk.TransactionalEmailsApi

  constructor() {
    const apiKey = process.env.BREVO_API_KEY
    const sender = process.env.BREVO_SENDER

    if (!apiKey || !sender) {
      throw new Error('Missing BREVO_API_KEY or BREVO_SENDER in environment variables')
    }

    const client = new SibApiV3Sdk.TransactionalEmailsApi()
    client.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey)
    this.brevo = client
  }

  /** Support both src/ and dist/ environments */
  private resolveTemplatePath(templateName: string): string {
    const prodPath = join(__dirname, 'templates', `${templateName}.hbs`)
    const devPath = join(
      process.cwd(),
      'src',
      'modules',
      'email',
      'templates',
      `${templateName}.hbs`
    )

    if (existsSync(prodPath)) return prodPath
    if (existsSync(devPath)) return devPath

    throw new Error(`Template "${templateName}.hbs" not found in either dist or src.`)
  }

  private compileTemplate(templateName: string, context: any): string {
    const templatePath = this.resolveTemplatePath(templateName)
    const source = readFileSync(templatePath, 'utf8')
    const template = hbs.compile(source)
    return template(context)
  }

  async sendActivationEmail(to: string, token: string) {
    const html = this.compileTemplate('activation', {
      activationLink: `${process.env.FRONTEND_URL}/activate?token=${token}`
    })

    const email = new SibApiV3Sdk.SendSmtpEmail()
    email.subject = 'Activate your account'
    email.htmlContent = html
    email.sender = { name: 'My App', email: process.env.BREVO_SENDER! }
    email.to = [{ email: to }]

    return this.brevo.sendTransacEmail(email)
  }

  async sendWelcomeEmail(to: string) {
    const html = this.compileTemplate('welcome', { email: to })

    const email = new SibApiV3Sdk.SendSmtpEmail()
    email.subject = 'Welcome 🎉'
    email.htmlContent = html
    email.sender = { name: 'My App', email: process.env.BREVO_SENDER! }
    email.to = [{ email: to }]

    return this.brevo.sendTransacEmail(email)
  }
}

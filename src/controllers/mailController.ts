import { Request, Response } from 'express'
import Mail from '../models/Mail'

export const createMail = async (req: Request, res: Response) => {
    const { subject, content, type, email } = req.body
    
}
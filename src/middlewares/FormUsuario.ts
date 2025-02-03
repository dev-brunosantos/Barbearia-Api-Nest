import {
    Injectable,
    NestMiddleware,
    UnauthorizedException
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FormUsuario implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { nome } = req.body;

        if (nome === '') {
            res.json('Erro');
            throw new UnauthorizedException('Erro');
        }

        next();
    }
}

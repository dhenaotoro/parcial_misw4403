import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ){}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({ relations: ["ciudades"] });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: ["ciudades"] } );
        if (!supermercado)
            throw new BusinessLogicException("No fue encontrado el supermercado con el id provisto.", BusinessError.NOT_FOUND);

        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if(!this.nombreSupermercadoPermitido(supermercado.nombre))
            throw new BusinessLogicException(`Supermercado ${supermercado.nombre} debe tener un nombre de más de 10 caracteres.`, BusinessError.SUPER_NAME_NOT_ALLOWED);

        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}});
        if (!persistedSupermercado)
            throw new BusinessLogicException("No fue encontrado el supermercado con el id provisto.", BusinessError.NOT_FOUND);
        
        if(!this.nombreSupermercadoPermitido(supermercado.nombre))
            throw new BusinessLogicException(`Supermercado ${supermercado.nombre} debe tener un nombre de más de 10 caracteres.`, BusinessError.SUPER_NAME_NOT_ALLOWED);

        return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}});
        if (!supermercado)
            throw new BusinessLogicException("No fue encontrado el supermercado con el id provisto.", BusinessError.NOT_FOUND);
    
        await this.supermercadoRepository.remove(supermercado);
    }

    private nombreSupermercadoPermitido(nombre: string) {
        return nombre.length > 10;
    }
}

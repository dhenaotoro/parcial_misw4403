import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class CiudadService {
    private paisesPermitidas = ['argentina', 'ecuador', 'paraguay'];

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ["supermercados"] });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"] } );
        if (!ciudad)
            throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND);

        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        if(!this.paisPermitido(ciudad.pais))
            throw new BusinessLogicException(`País ${ciudad.pais} no permitido para asociar la ciudad ${ciudad.nombre}.`, BusinessError.COUNTRY_NOT_ALLOWED);

        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!persistedCiudad)
            throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND);
        
        if(!this.paisPermitido(ciudad.pais))
            throw new BusinessLogicException(`País ${ciudad.pais} no permitido para asociar la ciudad ${ciudad.nombre}.`, BusinessError.COUNTRY_NOT_ALLOWED);

        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!ciudad)
            throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND);
    
        await this.ciudadRepository.remove(ciudad);
    }

    private paisPermitido(pais: string) {
        return this.paisesPermitidas.includes(pais.toLowerCase());
    }
}

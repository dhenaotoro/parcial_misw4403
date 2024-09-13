import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ) {}

    async addSupermarketToCity(city_id: string, supermarket_id: string): Promise<CiudadEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarket_id}});
        if (!supermercado)
          throw new BusinessLogicException("No fue encontrado el supermercado con el id provisto.", BusinessError.NOT_FOUND);

        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: city_id}, relations: ['supermercados']})
        if (!ciudad)
          throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND);
    
        ciudad.supermercados = [...ciudad.supermercados, supermercado];
        return await this.ciudadRepository.save(ciudad);
    }
  
    async findSupermarketFromCity(city_id: string, supermarket_id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarket_id}});
        if (!supermercado)
          throw new BusinessLogicException("No fue encontrado el supermercado con el id provisto.", BusinessError.NOT_FOUND)
        
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: city_id}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND)
    
        const supermercadoDeUnaCiudad: SupermercadoEntity = ciudad.supermercados.find(s => s.id === supermercado.id);
    
        if (!supermercadoDeUnaCiudad)
          throw new BusinessLogicException("El supermercado con el id dado no esta asociado a la ciudad.", BusinessError.PRECONDITION_FAILED)
    
        return supermercadoDeUnaCiudad;
    }
  
    async findSupermarketsFromCity(city_id: string): Promise<SupermercadoEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: city_id}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("No fue encontrada la ciudad con el id dado.", BusinessError.NOT_FOUND)
        
        return ciudad.supermercados;
    }
  
    async updateSupermarketsFromCity(city_id: string, supermarkets: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: city_id}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < supermarkets.length; i++) {
          const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarkets[i].id}});
          if (!supermercado)
            throw new BusinessLogicException("No fue encontrado el supermercado con el id dado.", BusinessError.NOT_FOUND)
        }
    
        ciudad.supermercados = supermarkets;
        return await this.ciudadRepository.save(ciudad);
    }
  
    async deleteSupermarketFromCity(city_id: string, supermarket_id: string){
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarket_id}});
        if (!supermercado)
          throw new BusinessLogicException("No fue encontrado el supermercado con el id provisto.", BusinessError.NOT_FOUND)
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: city_id}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("No fue encontrada la ciudad con el id provisto.", BusinessError.NOT_FOUND)
    
        const supermercadoDeUnaCiudad: SupermercadoEntity = ciudad.supermercados.find(s => s.id === supermercado.id);
        if (!supermercadoDeUnaCiudad)
            throw new BusinessLogicException("El supermercado con el id dado no esta asociado a la ciudad.", BusinessError.PRECONDITION_FAILED)
  
        ciudad.supermercados = ciudad.supermercados.filter(s => s.id !== supermarket_id);
        await this.ciudadRepository.save(ciudad);
    }
}

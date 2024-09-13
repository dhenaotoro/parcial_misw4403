import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercados : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();
 
    supermercados = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.company.name(),
          longitud: faker.location.longitude(),
          latitud: faker.location.latitude(),
          paginaWeb: faker.internet.url()
        })
        supermercados.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000})
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

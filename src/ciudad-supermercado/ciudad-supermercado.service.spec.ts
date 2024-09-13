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
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();
 
    supermercados = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.company.name(),
          longitud: faker.location.longitude().toString(),
          latitud: faker.location.latitude().toString(),
          paginaWeb: faker.internet.url()
        })
        supermercados.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000}),
      supermercados
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity debe crear un supermercado a una ciudad', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: 'Company Name',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url()
    });
 
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000})
    });
 
    const result: CiudadEntity = await service.addSupermarketToCity(nuevaCiudad.id, nuevoSupermercado.id);
   
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(nuevoSupermercado.nombre);
    expect(result.supermercados[0].longitud).toBe(nuevoSupermercado.longitud);
    expect(result.supermercados[0].latitud).toBe(nuevoSupermercado.latitud);
    expect(result.supermercados[0].paginaWeb).toBe(nuevoSupermercado.paginaWeb);
  });

  it('addSupermarketToCity debe lanzar una excepcion para un supermercado invalido', async () => {
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int({min: 500000, max: 1000000})
    });
 
    await expect(() => service.addSupermarketToCity(nuevaCiudad.id, "0")).rejects.toHaveProperty("message", "No fue encontrado el supermercado con el id provisto.");
  });

  it('addSupermarketToCity debe lanzar una excepcion para una ciudad invalida', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: 'Company Name',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url()
    });
 
    await expect(() => service.addSupermarketToCity("0", nuevoSupermercado.id)).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });

  it('findSupermarketFromCity debe retornar un supermercado por ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];
    const supermercadoAlmacenado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id)
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toBe(supermercado.nombre);
    expect(supermercadoAlmacenado.longitud).toBe(supermercado.longitud);
    expect(supermercadoAlmacenado.latitud).toBe(supermercado.latitud);
    expect(supermercadoAlmacenado.paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity debe lanzar una excepcion para un supermercado invalido', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "No fue encontrado el supermercado con el id provisto.");
  });

  it('findSupermarketFromCity debe lanzar una excepcion para una ciudad invalida', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });

  it('findSupermarketFromCity debe lanzar una excepcion para un supermercado no asociado a la ciudad', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url()
    });
 
    await expect(()=> service.findSupermarketFromCity(ciudad.id, nuevoSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no esta asociado a la ciudad.");
  });

  it('findSupermarketsFromCity debe retornar supermercados por ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5);
  });

  it('findSupermarketsFromCity debe lanzar una excepcion para una ciudad invalida', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id dado.");
  });

  it('updateSupermarketsFromCity debe actualizar lista de supermercados para una ciudad', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: 'Company Name',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url()
    });
 
    const ciudadActualizada: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [nuevoSupermercado]);
    expect(ciudadActualizada.supermercados.length).toBe(1);
 
    expect(ciudadActualizada.supermercados[0].nombre).toBe(nuevoSupermercado.nombre);
    expect(ciudadActualizada.supermercados[0].longitud).toBe(nuevoSupermercado.longitud);
    expect(ciudadActualizada.supermercados[0].latitud).toBe(nuevoSupermercado.latitud);
    expect(ciudadActualizada.supermercados[0].paginaWeb).toBe(nuevoSupermercado.paginaWeb);
  });

  it('updateSupermarketsFromCity debe lanzar una excepcion para una ciudad invalida', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: 'Company Name',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url()
    });
 
    await expect(()=> service.updateSupermarketsFromCity("0", [nuevoSupermercado])).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });

  it('updateSupermarketsFromCity debe lanzar una excepcion para un supermercado invalido', async () => {
    const nuevoSupermercado: SupermercadoEntity = supermercados[0];
    nuevoSupermercado.id = "0";
 
    await expect(()=> service.updateSupermarketsFromCity(ciudad.id, [nuevoSupermercado])).rejects.toHaveProperty("message", "No fue encontrado el supermercado con el id dado.");
  });

  it('deleteSupermarketFromCity debe eliminar un supermercado de una ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];
   
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);
 
    const ciudadAlmacenada: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ['supermercados']});
    const supermercadoBorrado: SupermercadoEntity = ciudadAlmacenada.supermercados.find(s => s.id === supermercado.id);
 
    expect(supermercadoBorrado).toBeUndefined();
  });

  it('deleteSupermarketFromCity debe lanzar una excepcion para un supermercado invalido', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "No fue encontrado el supermercado con el id provisto.");
  });

  it('deleteSupermarketFromCity debe lanzar una excepcion para una ciudad invalida', async () => {
    const supermercado: SupermercadoEntity = supermercados[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "No fue encontrada la ciudad con el id provisto.");
  });

  it('deleteSupermarketFromCity debe lanzar una excepcion para un supermercado no asociado a una ciudad', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: 'Company Name',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url()
    });
 
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, nuevoSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no esta asociado a la ciudad.");
  });
});

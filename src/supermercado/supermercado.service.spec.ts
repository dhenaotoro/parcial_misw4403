import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadoList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.company.name(),
        longitud: faker.location.longitude().toString(),
        latitud: faker.location.latitude().toString(),
        paginaWeb: faker.internet.url()
      });
      supermercadoList.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll debe retornar todos las supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadoList.length);
  });

  it('findOne debe retornar un supermercado por id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadoList[0];
    const supermercado = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud);
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud);
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb);
  });

  it('findOne debe lanzar una excepcion para un supermercado invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No fue encontrado el supermercado con el id provisto.");
  });

  it('create debe crear un nuevo supermercado cuando el nombre tiene mas de 10 caracteres', async () => {
    const supermercado: SupermercadoEntity = {
      id: faker.string.uuid(),
      nombre: 'Company Name',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url(),
      ciudades: [ Object.assign(new CiudadEntity(), {}) ]
    };
    const nuevoSupermercado: SupermercadoEntity = await service.create(supermercado);

    const almacenadaSupermercado: SupermercadoEntity = await repository.findOne({where: {id: nuevoSupermercado.id}});
    expect(almacenadaSupermercado).not.toBeNull();
    expect(almacenadaSupermercado.nombre).toEqual(nuevoSupermercado.nombre);
    expect(almacenadaSupermercado.latitud).toEqual(nuevoSupermercado.latitud);
    expect(almacenadaSupermercado.longitud).toEqual(nuevoSupermercado.longitud);
    expect(almacenadaSupermercado.paginaWeb).toEqual(nuevoSupermercado.paginaWeb);
  });

  it('create debe lanzar una excepcion al crear un supermercado cuando el nombre es igual a 10 caracteres', async () => {
    const supermercado: SupermercadoEntity = {
      id: faker.string.uuid(),
      nombre: 'Company123',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url(),
      ciudades: [ Object.assign(new CiudadEntity(), {}) ]
    };

    await expect(() => service.create(supermercado)).rejects.toHaveProperty('message', `Supermercado ${supermercado.nombre} debe tener un nombre de más de 10 caracteres.`);
  });

  it('create debe lanzar una excepcion al crear un supermercado cuando el nombre es menor a 10 caracteres', async () => {
    const supermercado: SupermercadoEntity = {
      id: faker.string.uuid(),
      nombre: 'Company12',
      longitud: faker.location.longitude().toString(),
      latitud: faker.location.latitude().toString(),
      paginaWeb: faker.internet.url(),
      ciudades: [ Object.assign(new CiudadEntity(), {}) ]
    };

    await expect(() => service.create(supermercado)).rejects.toHaveProperty('message', `Supermercado ${supermercado.nombre} debe tener un nombre de más de 10 caracteres.`);
  });

  it('update debe modificar un supermercado cuando el nombre tiene mas de 10 caracteres', async () => {
    const supermercadoAActualizar = supermercadoList[0];
    supermercadoAActualizar.nombre = 'Company Name';

    const actualizadoSupermercado = await service.update(supermercadoAActualizar.id, supermercadoAActualizar);
    expect(actualizadoSupermercado).not.toBeNull();

    expect(actualizadoSupermercado.nombre).toEqual(supermercadoAActualizar.nombre);
  });

  it('update debe lanzar una excepcion al actualizar un supermercado cuando el nombre es igual a 10 caracteres', async () => {
    const supermercadoAActualizar = supermercadoList[0];
    supermercadoAActualizar.nombre = 'Company123';

    await expect(() => service.update(supermercadoAActualizar.id, supermercadoAActualizar)).rejects.toHaveProperty("message", `Supermercado ${supermercadoAActualizar.nombre} debe tener un nombre de más de 10 caracteres.`);
  });

  it('update debe lanzar una excepcion al actualizar un supermercado cuando el nombre es menor a 10 caracteres', async () => {
    const supermercadoAActualizar = supermercadoList[0];
    supermercadoAActualizar.nombre = 'Company12';

    await expect(() => service.update(supermercadoAActualizar.id, supermercadoAActualizar)).rejects.toHaveProperty("message", `Supermercado ${supermercadoAActualizar.nombre} debe tener un nombre de más de 10 caracteres.`);
  });

  it('delete debe eliminar un supermercado', async () => {
    const supermercadoAEliminar = supermercadoList[0];

    await service.delete(supermercadoAEliminar.id);

    const supermercadoEliminado = await repository.findOne({ where: {id: supermercadoAEliminar.id}});
    expect(supermercadoEliminado).toBeNull();
  });

  it('delete debe lanzar una excepcion para un supermercado invalido', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No fue encontrado el supermercado con el id provisto.");
  });
});

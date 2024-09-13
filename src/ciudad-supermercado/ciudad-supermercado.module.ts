import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity/supermercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  providers: [CiudadSupermercadoService]
})
export class CiudadSupermercadoModule {}

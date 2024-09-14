import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from './ciudad.dto/ciudad.dto';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

    @Get()
    async findAll() {
        return await this.ciudadService.findAll();
    }

    @Get(':ciudadId')
    async findOne(@Param('ciudadId') ciudadId: string) {
        return await this.ciudadService.findOne(ciudadId);
    }

    @Post()
    async create(@Body() ciudadDto: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
        return await this.ciudadService.create(ciudad);
    }

    @Put(':ciudadId')
    async update(@Param('ciudadId') ciudadId: string, @Body() CiudadDto: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, CiudadDto);
        return await this.ciudadService.update(ciudadId, ciudad);
    }

    @Delete(':ciudadId')
    @HttpCode(204)
    async delete(@Param('ciudadId') ciudadId: string) {
        return await this.ciudadService.delete(ciudadId);
    }
}

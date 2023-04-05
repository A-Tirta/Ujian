import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prismaClient } from '../config';
import { returnResponse} from '../interface';

const router = Router();

let resObject: returnResponse;

router.post('/:id_mata_pelajaran', body('soal').isString(), async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, soal, ...body } = req.body;
        const { id_mata_pelajaran }: any = req.params;
        const createSoal = await prismaClient.soal.create({
          data: {
            soal,
            matapelajaran_id: {
                connect: {
                    id: Number(id_mata_pelajaran)
                }
            },
            ...body,
          },
          select: {
            soal: true,
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Soal berhasil dibuat',
            data: createSoal,
          },
        };
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.put('/:id_ubah_soal', body('soal').isString(), async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, soal, ...body } = req.body;
  
        const { id_ubah_soal }: any = req.params;
  
        const updateSoal = await prismaClient.soal.update({
          where: {
            id: Number(id_ubah_soal),
          },
  
          data: {
            soal,
            ...body,
          },
          select: {
            soal: true,
            pilihan_ganda: {
              select: {
                pilihan_A: true,
                pilihan_B: true,
                pilihan_C: true,
                pilihan_D: true,
              }
            },
            jawaban: {
              select: {
                jawaban: true,
              }
            },
            matapelajaran_id: {
                select: {
                    mata_pelajaran: true,
                }
            }
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Soal berhasil diupdate',
            data: updateSoal,
          },
        };
  
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const rows = await prismaClient.soal.findMany({
          select: {
            soal: true,
            pilihan_ganda: {
                select: {
                    pilihan_A: true,
                    pilihan_B: true,
                    pilihan_C: true,
                    pilihan_D: true,
                }
            },
            jawaban: {
                select: {
                    jawaban: true,
                }
            },
            matapelajaran_id: {
                select: {
                    mata_pelajaran: true,
                }
            }
          },
        });
  
        resObject = {
          statuscode: 200,
          data: {
            message: 'Get All Soal',
            data: rows,
          },
        };
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const { id }: any = req.params;
  
          const row = await prismaClient.soal.findUnique({
            where: {
              id: Number(id),
            },
            select: {
                soal: true,
                pilihan_ganda: {
                    select: {
                        pilihan_A: true,
                        pilihan_B: true,
                        pilihan_C: true,
                        pilihan_D: true,
                    }
                },
                jawaban: {
                    select: {
                        jawaban: true,
                    }
                },
                matapelajaran_id: {
                    select: {
                        mata_pelajaran: true,
                    }
                }
              },
          });
  
          resObject = {
            statuscode: 200,
            data: {
              message: 'Get Soal',
              data: row,
            },
          };
      } catch (error) {
        console.log(error);
  
        resObject = {
          statuscode: 500,
          data: {
            message: 'Ada sesuatu yang salah dari server',
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: 'Form masih ada yang kurang, coba cek lagi',
          info: err.array(),
        },
      };
    }
  
    return res.status(resObject.statuscode).json(resObject.data);
});

router.delete('/:id_hapus', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const { id_hapus }: any = req.params;

      const getPilihanGandaTerdaftar = await prismaClient.pilihanGanda.findFirst({
        where: {
          SoalId: Number(id_hapus),
        },
        select: {
          pilihan_A: true,
          pilihan_B: true,
          pilihan_C: true,
          pilihan_D: true,
        },
      });

      const getJawabanTerdaftar = await prismaClient.jawaban.findFirst({
        where: {
          SoalId: Number(id_hapus),
        },
        select: {
          jawaban: true,
        },
      });

      if (getJawabanTerdaftar !== null || getPilihanGandaTerdaftar !== null) {
        const deletePilihanGanda = await prismaClient.pilihanGanda.delete({
          where: {
            SoalId: Number(id_hapus),
          },
        });

        const deleteJawaban = await prismaClient.jawaban.delete({
          where: {
            SoalId: Number(id_hapus),
          },
        });

        const deleteSoal = await prismaClient.soal.delete({
          where: {
            id: Number(id_hapus),
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Soal di hapus',
          },
        };
      } else {
        const deleteSoal = await prismaClient.soal.delete({
          where: {
            id: Number(id_hapus),
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Soal di hapus',
          },
        };
      }
    } catch (error) {
      console.log(error);

      resObject = {
        statuscode: 500,
        data: {
          message: 'Ada sesuatu yang salah dari server',
        },
      };
    }
  } else {
    resObject = {
      statuscode: 400,
      data: {
        message: 'Form masih ada yang kurang, coba cek lagi',
        info: err.array(),
      },
    };
  }

  return res.status(resObject.statuscode).json(resObject.data);
});
 
export default router;
import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prismaClient } from '../config';
import { returnResponse} from '../interface';

const router = Router();

let resObject: returnResponse;

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const rows = await prismaClient.mataPelajaran.findMany({
        select: {
          mata_pelajaran: true,
          soal: {
            select: {
              soal:true,
              pilihan_ganda: {
                select: {
                  pilihan_A: true,
                  pilihan_B: true,
                  pilihan_C: true,
                  pilihan_D: true
                }
              },
              jawaban: {
                select: {
                  jawaban: true
                }
              }
            }
          }
        },
      });

      resObject = {
        statuscode: 200,
        data: {
          message: 'Get All Mata Pelajaran',
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

        const row = await prismaClient.mataPelajaran.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            mata_pelajaran: true,
            soal: {
              select: {
                soal:true,
                pilihan_ganda: {
                  select: {
                    pilihan_A: true,
                    pilihan_B: true,
                    pilihan_C: true,
                    pilihan_D: true
                  }
                },
                jawaban: {
                  select: {
                    jawaban: true
                  }
                }
              }
            }
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Get Mata Pelajaran',
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

router.post('/buat_pelajaran', body('mata_pelajaran').isString().isLength({ max: 50 }), async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  
  if (err.isEmpty()) {
    try {
      const { id, create_at, update_at, mata_pelajaran, ...body } = req.body;

      const createPelajaran = await prismaClient.mataPelajaran.create({
        data: {
          mata_pelajaran,
          ...body,
        },

        select: {
          mata_pelajaran: true,
          create_at: true,
          update_at: true,
        },
      });

      resObject = {
        statuscode: 200,
        data: {
          message: 'Pelajaran berhasil dibuat',
          data: createPelajaran,
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
    console.log(err)
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

router.put('/:id_ubah_pelajaran', body('mata_pelajaran').isString().isLength({ max: 50 }), async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const { id, create_at, update_at, mata_pelajaran, ...body } = req.body;

      const { id_ubah_pelajaran }: any = req.params;

      const updatePelajaran = await prismaClient.mataPelajaran.update({
        where: {
          id: Number(id_ubah_pelajaran),
        },

        data: {
          mata_pelajaran,
          ...body,
        },
        select: {
          mata_pelajaran: true,
        },
      });

      resObject = {
        statuscode: 200,
        data: {
          message: 'Pelajaran berhasil diupdate',
          data: updatePelajaran,
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

        const getSoalTerdaftar = await prismaClient.soal.findFirst({
          where: {
            MataPelajaranId: Number(id_hapus),
          },
          select: {
            soal: true,
          },
        });

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
  
        if (getSoalTerdaftar !== null || getJawabanTerdaftar !== null || getPilihanGandaTerdaftar !== null) {
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

          const deleteSoal = await prismaClient.soal.deleteMany({
            where: {
              MataPelajaranId: Number(id_hapus),
            },
          });
          
          const deleteMataPelajaran = await prismaClient.mataPelajaran.delete({
            where: {
              id: Number(id_hapus),
            },
          });
  
          resObject = {
            statuscode: 200,
            data: {
              message: 'Mata Pelajaran di hapus',
            },
          };
        } else {
          const deleteMataPelajaran = await prismaClient.mataPelajaran.delete({
            where: {
              id: Number(id_hapus),
            },
          });
  
          resObject = {
            statuscode: 200,
            data: {
              message: 'Mata Pelajaran di hapus',
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

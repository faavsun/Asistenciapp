import { inject, Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,sendPasswordResetEmail,updatePassword, signOut} from 'firebase/auth'
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,setDoc,doc, getDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Seccion } from '../models/seccion.model';
import { Asignatura } from '../models/asignatura.model';
import { AlumnoSeccion } from '../models/alumnoseccion.model';
import { Observable, switchMap, combineLatest, map } from 'rxjs';
import { Asistencia } from '../models/asistencia.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  localStorageSvc = inject(LocalStorageService);
  navCtrl =  inject(NavController);

 asignaturas: { id: string; nombre: string; profesor: string }[] = [];
  seccionesPorAsignatura: { [key: string]: any[] } = {}; // Cambia el tipo según tu necesidad
//==================== Autentificacion=========================

//============ proteger rutas=========
getAuth(){
  return getAuth();
}

//=========Acceder==========
signIn(user: User){
  return signInWithEmailAndPassword(getAuth(),user.email,user.password)
  .then((userCredential) => {
    localStorage.setItem('userUid', userCredential.user.uid);
    localStorage.setItem('sessionActive', 'true'); 
    return userCredential;
  });
}

//=========Crear==========
signUp(user: User){
  localStorage.setItem('sessionActive', 'true');
  return createUserWithEmailAndPassword(getAuth(),user.email,user.password)
}

//=========Actualizar==========
updateUser(displayName: string){
  return updateProfile(getAuth().currentUser, {displayName})
}

//================== actualizar password=========

  // Método para cambiar la contraseña
  async updatePassword(newPassword: string): Promise<void> {
    if (!newPassword || newPassword.trim() === '') {
      this.utilsSvc.showToast("La nueva contraseña no puede estar vacía.");
      throw new Error("La nueva contraseña no puede estar vacía.");
    }
  
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (user) {
      try {
        await updatePassword(user, newPassword);
        console.log("Contraseña actualizada exitosamente");
        this.utilsSvc.showToast("Contraseña actualizada exitosamente");
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          console.error("La sesión ha expirado. Se requiere reautenticación.", error);
          throw new Error("La sesión ha expirado. Por favor, vuelve a iniciar sesión para cambiar tu contraseña.");
        } else {
          console.error("Error al cambiar la contraseña", error);
          throw new Error("Ocurrió un error al cambiar la contraseña. Inténtalo nuevamente.");
        }
      }
    } else {
      throw new Error("No hay usuario autenticado.");
    }
  }

//========== enviar email para restablecer============
sendRecoveryEmail(email: string){
  return sendPasswordResetEmail(getAuth(),email);
}

//========== Cerrar sesión===============
signOut() {
  const auth = getAuth();
  signOut(auth).then(() => {
    this.resetUserData();
    const scannedUIDs = localStorage.getItem('scannedUIDs');
    localStorage.setItem('sessionActive', 'false');
    this.navCtrl.navigateRoot('/login');
    
    if (scannedUIDs) {
      localStorage.setItem('scannedUIDs', scannedUIDs);
    }
  }).catch((error) => {
    console.error('Error al cerrar sesión:', error);
  });
}

resetUserData() {
  this.asignaturas = [];
  this.seccionesPorAsignatura = {};
}

//============================== Base de datos=================

//=== setear un documento==========
setDocument(path: string,data: any){
  return setDoc(doc(getFirestore(),path),data);
}

//=== Obtener un documento==========
async getDocument(path: string){
  return (await getDoc(doc(getFirestore(),path))).data();
}

//=======================================================//
  async createAsignatura(asignatura: Asignatura) {
    try {
      const asignaturasRef = this.firestore.collection('asignatura');
      const docRef = await asignaturasRef.add(asignatura);
      return docRef;
    } catch (error) {
      console.error('Error al crear la asignatura: ', error);
      throw error;
    }
  }

  async updateAsignatura(asignatura: Asignatura) {
    try {
      if (!asignatura.uid) {
        throw new Error('UID de asignatura es necesario para la actualización');
      }
      const asignaturaRef = this.firestore.collection('asignatura').doc(asignatura.uid);
      await asignaturaRef.set(asignatura);
    } catch (error) {
      console.error('Error al actualizar la asignatura: ', error);
      throw error;
    }
  }

  async createSeccion(seccion: Seccion) {
    try {
      const docRef = await this.firestore.collection('seccion').add(seccion);
      return docRef;
    } catch (error) {
      console.error('Error al crear la sección:', error);
      throw new Error('Error al crear la sección');
    }
  }
  
  async updateSeccion(seccion: Seccion) {
    try {
      if (!seccion.uid) {
        throw new Error('UID de seccion es necesario para la actualización');
      }
      const seccionRef = this.firestore.collection('seccion').doc(seccion.uid);
      await seccionRef.set(seccion);
    } catch (error) {
      console.error('Error al actualizar la seccion: ', error);
      throw error;
    }
  }

async getAsignaturasPorProfesor(profesorUid: string): Promise<Asignatura[]> {
  try {
    const asignaturasSnapshot = await this.firestore.collection<Asignatura>('asignatura', ref => 
      ref.where('uid_profesor', '==', profesorUid)).get().toPromise();
    return asignaturasSnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error al obtener asignaturas para el profesor:', error);
    throw error;
  }
}

async getAllSecciones(): Promise<Seccion[]> {
  try {
    const snapshot = await this.firestore.collection('seccion').get().toPromise();
    if (snapshot.empty) {
      console.log('No se encontraron secciones en Firestore.');
      return [];
    }
    const secciones = snapshot.docs.map(doc => {
      const data = doc.data() as { nombre: string; asignatura: string; profesor: string; aula?: string; total_clases?: number };
      return {
        uid: doc.id,
        nombre: data.nombre || '', 
        asignatura: data.asignatura || '', 
        profesor: data.profesor || '', 
        aula: data.aula || '', 
        total_clases: data.total_clases || 0 
      };
    });
    console.log("Secciones obtenidas de Firestore:", secciones);
    return secciones;
  } catch (error) {
    console.error('Error al obtener las secciones:', error);
    throw error;
  }
}

async getProfesorNombre(uid: string): Promise<{ name: string; lastname: string }> {
  const docRef = doc(getFirestore(), `users/${uid}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      name: data["name"],
      lastname: data["lastname"]
    };
  } else {
    console.log("No se encontró el profesor.");
    return { name: "", lastname: "" };
  }
}


async getSeccionPorId(id: string): Promise<Seccion | null> {
  console.log('Buscando sección con ID:', id);
  return new Promise<Seccion | null>((resolve, reject) => {
    this.firestore.collection('seccion').doc(id).get().subscribe({
      next: (seccionDoc) => {
        console.log('Resultado de la consulta:', seccionDoc.exists, seccionDoc.data());
        if (seccionDoc.exists) {
          const data = seccionDoc.data();
          if (data && typeof data === 'object') {
            resolve({ uid: seccionDoc.id, ...data } as Seccion);
          } else {
            console.error('Los datos de la sección no son un objeto:', data);
            resolve(null);
          }
        } else {
          console.error('Sección no encontrada:', id);
          resolve(null);
        }
      },
      error: (error) => {
        console.error('Error obteniendo la sección:', error);
        reject(error);
      },
    });
  });
}

async getAsignaturaPorId(uid: string): Promise<Asignatura | null> {
  const docRef = doc(getFirestore(), `asignatura/${uid}`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return { uid: docSnap.id, uid_profesor: data['uid_profesor'],nombre: data['nombre'], maxEstudiantes: data['maxEstudiantes'] };
  } else {
    console.error('Asignatura no encontrada:', uid);
    return null;
  }
}

async getSeccionById(seccionId: string): Promise<Seccion | null> {
  try {
    const seccionDoc = await this.firestore.collection('seccion').doc(seccionId).get().toPromise();
    if (seccionDoc.exists) {
      const seccionData = seccionDoc.data() as Seccion;
      return { uid: seccionId, ...seccionData };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener la sección:', error);
    return null;
  }
}

async getAsignaturaById(asignaturaId: string): Promise<Asignatura> {
  const asignaturaDoc = await this.firestore.collection('asignatura').doc(asignaturaId).get().toPromise();
  if (asignaturaDoc.exists) {
    return asignaturaDoc.data() as Asignatura;
  } else {
    throw new Error('Asignatura no encontrada');
  }
}

async getUserById(uid: string): Promise<User | null> {
  const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
  if (userDoc.exists) {
      const data = userDoc.data() as User;
      return { uid: userDoc.id, ...data };
  }
  return null;
}


getAlumnosPorSeccion(seccionId: string): Promise<AlumnoSeccion[]> {
  return this.firestore.collection<AlumnoSeccion>('alumnoseccion', ref => ref.where('seccion', '==', seccionId))
    .get()
    .toPromise()
    .then(snapshot => {
      const alumnos: AlumnoSeccion[] = [];
      snapshot.forEach(doc => alumnos.push(doc.data()));
      return alumnos;
    })
    .catch(error => {
      console.error('Error obteniendo los alumnos:', error);
      throw error;
    });
}


getEstudiantesBySeccion(seccionId: string): Observable<User[]> {
  return this.firestore.collection<AlumnoSeccion>('alumnoseccion', ref => ref.where('seccion', '==', seccionId)).snapshotChanges().pipe(
    switchMap(actions => {
      const uids = actions.map(a => a.payload.doc.data().alumno);
      console.log('UIDs obtenidos:', uids); 
      const users$ = this.firestore.collection<User>('users', ref => ref.where('uid', 'in', uids)).valueChanges();
      const asistencia$ = this.firestore.collection<Asistencia>('asistencia', ref => ref.where('seccion_id', '==', seccionId).where('estudiante_id', 'in', uids)).valueChanges();
      const seccion$ = this.firestore.collection<Seccion>('seccion').doc(seccionId).valueChanges();
      return combineLatest([users$, asistencia$, seccion$]).pipe(
        map(([users, asistencia, seccion]) => {
          return users.map(user => {
            const asistenciaEstudiante = asistencia.find(a => a.estudiante_id === user.uid);
            return {
              ...user,
              total_asistencia: asistenciaEstudiante ? asistenciaEstudiante.total_asistencia : 0,
              seccion: seccion,
            };
          });
        })
      );
    })
  );
}


getAsistenciaPorEstudianteYSeccion(estudianteId: string, seccionId: string): Promise<any[]> {
  return this.firestore.collection('asistencia', ref =>
    ref.where('estudiante_id', '==', estudianteId)
       .where('seccion_id', '==', seccionId)
  )
  .get()
  .toPromise()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No se encontraron registros de asistencia');
      return [];
    } else {
      return snapshot.docs.map(doc => doc.data()); 
    }
  })
  .catch(error => {
    console.error('Error obteniendo la asistencia:', error);
    return []; 
  });
}


//////////////////////////ASISTENCIA_QR_MARCAR//////////////////////////////////////////////////////////////////////////////////////////////////////

async obtenerAsistenciaEstudiantePorSeccion(estudianteId: string, seccionId: string): Promise<Asistencia[]> {
  try {
    const snapshot = await this.firestore.collection('asistencia', ref =>
      ref.where('estudiante_id', '==', estudianteId)
         .where('seccion_id', '==', seccionId)
    ).get().toPromise();

    if (snapshot.empty) {
      console.log('No se encontraron registros de asistencia');
      return []; 
    } else {
      return snapshot.docs.map(doc => {
        return {
          id: doc.id, 
          ...doc.data() as Asistencia 
        };
      });
    }
  } catch (error) {
    console.error('Error obteniendo la asistencia:', error);
    return [];
  }
}

async actualizarAsistencia(uid: string, totalAsistencia: number) {
  try {
    const asistenciaDocRef = this.firestore.doc(`asistencia/${uid}`);
    await asistenciaDocRef.update({ total_asistencia: totalAsistencia });
    console.log(`Asistencia actualizada para uid: ${uid} con total_asistencias: ${totalAsistencia}`);
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    throw error;
  }
}

async crearAsistencia(asistencia: any) {
  try {
    const docRef = await this.firestore.collection('asistencia').add(asistencia);
    console.log('Documento de asistencia creado con ID: ', docRef.id);
  } catch (error) {
    console.error('Error al crear el documento de asistencia:', error);
    throw error;
  }
}


getAsignaturas(): Observable<Asignatura[]> {
  return this.firestore.collection<Asignatura>('asignatura').valueChanges();
}

getTodasLasSecciones(): Observable<Seccion[]> {
  return this.firestore.collection('seccion').valueChanges({ idField: 'uid' }).pipe(
    map((data: any[]) => 
      data.map(item => ({
        uid: item.uid,
        nombre: item.nombre || '',
        asignatura: item.asignatura || '',
        aula: item.aula || '',
        profesor: item.profesor || ''
      }))
    )
  );
}

// Método para inscribir al estudiante
inscribirEstudiante(alumnoUid: string, seccionUid: string,asignaturaUid: string ): Promise<void> {
  if (!alumnoUid || !seccionUid || !asignaturaUid) {
    return Promise.reject('Faltan datos para realizar la inscripción. Verifica que los valores sean correctos.');
  }  
  
  const inscripcionRef = this.firestore.collection('alumnoseccion').doc(); // Genera un nuevo documento
  return inscripcionRef.set({
    alumno: alumnoUid,
    seccion: seccionUid,
    asignatura: asignaturaUid,
  });
}


// Método que verifica si el alumno ya está inscrito en una sección de la misma asignatura
async verificarInscripcionExistente(alumnoUid: string, asignaturaUid: string): Promise<boolean> {
  try {
    const inscripcionesRef = this.firestore.collection('alumnoseccion', ref => ref.where('alumno', '==', alumnoUid).where('asignatura', '==', asignaturaUid));
    const snapshot = await inscripcionesRef.get().toPromise();
    return snapshot.empty;
  } catch (error) {
    console.error('Error al verificar la inscripción:', error);
    throw new Error('Error al verificar la inscripción');
  }
}

/**
 * Sincroniza las asistencias almacenadas localmente con Firebase.
 */
async syncOfflineAttendance() {
  const asistenciasOffline = await this.localStorageSvc.get('asistencias_offline');

  if (asistenciasOffline && asistenciasOffline.length > 0) {
    for (const asistencia of asistenciasOffline) {
      const asistenciaExistente = await this.obtenerAsistenciaEstudiantePorSeccion(asistencia.estudiante_id, asistencia.seccion_id);

      if (asistenciaExistente && asistenciaExistente.length > 0) {
        const asistenciaFirebase = asistenciaExistente[0];
        const updatedTotal = (asistenciaFirebase.total_asistencia || 0) + asistencia.total_asistencia;
        await this.actualizarAsistencia(asistenciaFirebase.id, updatedTotal);
      } else {
        await this.crearAsistencia({
          estudiante_id: asistencia.estudiante_id,
          seccion_id: asistencia.seccion_id,
          total_asistencia: asistencia.total_asistencia,
        });
      }
    }

    // Limpia los datos locales después de sincronizar
    await this.localStorageSvc.set('asistencias_offline', []);
    console.log('Sincronización de asistencias completada.');
  }
}


  // Método para sincronizar las asignaturas offline con Firebase
  async syncOfflineAsignaturas() {
    const asignaturasOffline = (await this.localStorageSvc.get('asignaturasOffline')) || [];

    if (asignaturasOffline.length > 0) {
      for (const asignatura of asignaturasOffline) {
        try {
          const asignaturaCreada = await this.createAsignatura(asignatura);
          asignatura.uid = asignaturaCreada.id;
          await this.updateAsignatura(asignatura);
          const updatedAsignaturasOffline = asignaturasOffline.filter((a: Asignatura) => a.uid !== asignatura.uid);
          await this.localStorageSvc.set('asignaturasOffline', updatedAsignaturasOffline);
        } catch (error) {
          console.error('Error al sincronizar asignatura offline:', error);
        }
      }
    }
  }

  async syncOfflineSecciones() {
    const seccionesOffline = await this.localStorageSvc.get('seccionesOffline') || [];
  
    if (seccionesOffline.length === 0) {
      console.log('No hay secciones para sincronizar.');
      return;
    }
    for (const seccion of seccionesOffline) {
      try {
        const docRef = await this.createSeccion(seccion);
        seccion.uid = docRef.id; 
        await this.updateSeccion(seccion);
        console.log('Sección sincronizada:', seccion);
      } catch (error) {
        console.error('Error al sincronizar la sección:', error);
      }
    }
    await this.localStorageSvc.set('seccionesOffline', []); 
    console.log('Secciones offline sincronizadas correctamente.');
  }


  async sincronizarInscripciones() {
    const inscripcionesOffline = this.localStorageSvc.get('inscripcionesOffline') || [];
    for (const inscripcion of inscripcionesOffline) {
      const yaInscripto = await this.verificarInscripcionExistente(
        inscripcion.alumno,
        inscripcion.asignatura
      );
      if (!yaInscripto) {
        this.utilsSvc.presentToast({
          message: `El estudiante ya está inscrito en otra sección de la asignatura`,
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        continue;
      }
      await this.inscribirEstudiante(
        inscripcion.alumno,
        inscripcion.seccion,
        inscripcion.asignatura
      );
    }
    this.localStorageSvc.set('inscripcionesOffline', []);
    this.localStorageSvc.set('datosoffline', []);
  }

  async getAlumnoSeccion(uidAlumno: string): Promise<AlumnoSeccion[]> {
    const querySnapshot = await this.firestore
      .collection<AlumnoSeccion>('alumnoseccion', ref => ref.where('alumno', '==', uidAlumno))
      .get()
      .toPromise();

    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...(doc.data() as AlumnoSeccion),
    }));
  }
  
  async getSeccion(uidSeccion: string): Promise<Seccion> {
    const doc = await this.firestore
      .collection<Seccion>('seccion')
      .doc(uidSeccion)
      .get()
      .toPromise();
    return { uid: doc.id, ...(doc.data() as Seccion) };
  }
  
  async getAsignatura(uidAsignatura: string): Promise<Asignatura> {
    const doc = await this.firestore
      .collection<Asignatura>('asignatura')
      .doc(uidAsignatura)
      .get()
      .toPromise();
    return { uid: doc.id, ...(doc.data() as Asignatura) };
  }
  
  async getProfesor(uidProfesor: string): Promise<User> {
    const doc = await this.firestore
      .collection<User>('users')
      .doc(uidProfesor)
      .get()
      .toPromise();
    return { uid: doc.id, ...(doc.data() as User) };
  }

  async getAllSeccion(): Promise<any[]> {
    const snapshot = await this.firestore.collection('seccion').get().toPromise();
    return snapshot.docs.map(doc => {
      const data = doc.data() as { [key: string]: any };
      return { uid: doc.id, ...data };
    });
  }
  
  async getAllAsignaturas(): Promise<any[]> {
    const snapshot = await this.firestore.collection('asignatura').get().toPromise();
    return snapshot.docs.map(doc => {
      const data = doc.data() as { [key: string]: any };
      return { uid: doc.id, ...data };
    });
  }
  
  async getAllUsers(): Promise<any[]> {
    const snapshot = await this.firestore.collection('users').get().toPromise();
    return snapshot.docs.map(doc => {
      const data = doc.data() as { [key: string]: any };
      return { uid: doc.id, ...data };
    });
  }
  
}

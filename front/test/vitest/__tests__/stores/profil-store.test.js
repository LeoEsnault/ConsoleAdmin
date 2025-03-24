import { setActivePinia, createPinia } from 'pinia';
import { useProfilStore } from 'src/stores/profil-store.js';
import { api } from 'src/boot/axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('src/boot/axios');
vi.mock('src/supabase/supabase', () => ({
    supabase: {
      auth: {
        getSession: vi.fn(),
      },
    },
  }));
  vi.mock("quasar", () => ({
    Notify: {
      create: vi.fn(),
    },
  }));

describe('useProfilStore', () => {
  let localStorageMock ;
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock;

    vi.clearAllMocks();
  });

  it('updateProfil doit update les datas', async () => {
    const store = useProfilStore();
    
    const mockUserId = '123';
    global.localStorage = {
      getItem: vi.fn().mockReturnValue(mockUserId),
    };
  
    const mockResponse = { success: true };
    api.put.mockResolvedValue({ data: mockResponse });
  
    const data = { name: 'Jane Darc' };
    const result = await store.updateProfil(data);
  

    expect(result.data).toEqual(mockResponse);
    api.put.mockResolvedValueOnce({ data: mockResponse });
  });
  


  it('updateProfil doit mettre à jour les données', async () => {
    const store = useProfilStore();
  
    const mockUser = { id: '123' };
    global.localStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(mockUser)),
    };
  
    const mockResponse = { success: true };
    api.put.mockResolvedValue({ data: mockResponse });
  
    const data = { name: 'Jane Darc' };
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
  
    expect(userId).toBe('123');
  
    const result = await store.updateProfil(data);
  
    expect(result.data).toEqual(mockResponse);
    expect(api.put).toHaveBeenCalledWith(`/profiles/${userId}`, data); 
  });


  test('should update password successfully', async () => {
    const store = useProfilStore();
    const newPassword = 'new_password';
    const id = '123';
  
    // Mock de localStorage pour récupérer un utilisateur avec l'ID
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ id })),  // Simule un utilisateur avec l'ID
      setItem: vi.fn(),
    };
    global.localStorage = localStorageMock;  // Utilise le mock globalement
  
    // Mock de la méthode API put
    vi.spyOn(api, 'put').mockResolvedValue({ error: null });
  
    // Appel de la méthode updatePassword
    const result = await store.updatePassword(newPassword);
  
    // Vérification que getItem a bien été appelé avec 'user'
    expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
    
    // Vérification que l'API a bien été appelée avec les bons arguments
    expect(api.put).toHaveBeenCalledWith(`/update/${id}`, newPassword);
  
    // Vérification du résultat retourné
    expect(result).toEqual({
      type: 'success',
      message: 'Mot de passe mis à jour avec succés.',
    });
  });
  
  test('should return error if updatePassword throws an error', async () => {
    const store = useProfilStore();
    const newPassword = 'new_password';
  
    // Mock de localStorage pour récupérer un utilisateur avec l'ID
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ id: '123' })),  // Simule un utilisateur avec l'ID
      setItem: vi.fn(),
    };
    global.localStorage = localStorageMock;  // Utilise le mock globalement
  
    // Simule une erreur dans l'appel API
    vi.spyOn(api, 'put').mockRejectedValue(new Error('API error'));
  
    // Appel de la méthode updatePassword
    const result = await store.updatePassword(newPassword);
  
    // Vérification que l'API a bien été appelée avec les bons arguments
    expect(api.put).toHaveBeenCalledWith('/update/123', newPassword);
  
    // Vérification du résultat retourné pour l'erreur
    expect(result).toEqual({
      type: 'error',
      message: 'Une erreur est survenue. Veuillez verifier votre mot de passe.'
    });
  });
  
});

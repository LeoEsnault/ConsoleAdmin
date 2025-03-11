import { setActivePinia, createPinia } from 'pinia';
import { useProfilStore } from 'src/stores/profil-store.js';
import { api } from 'src/boot/axios';
import { supabase } from 'src/supabase/supabase';
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
  beforeEach(() => {
    setActivePinia(createPinia());
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
    expect(api.put).toHaveBeenCalledWith(`/profiles/${mockUserId}`, data);
  });
});

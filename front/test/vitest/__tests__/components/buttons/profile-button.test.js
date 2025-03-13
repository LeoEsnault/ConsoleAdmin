import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileButton from 'src/components/buttons/ProfileButton.vue';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithEmail: vi.fn().mockResolvedValue({
        user: { id: 1 },
        error: null
      }),
      signUp: vi.fn().mockResolvedValue({
        user: { id: 2 },
        error: null
      })
    },
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }))
}))

describe('ProfileButton.vue', () => {
  let wrapper;

  beforeEach(() => {
    
    wrapper = mount(ProfileButton);
  });

  it('doit rendre le bouton profile-btn', () => {
    const profileBtn = wrapper.find('.profile-btn');
    
    expect(profileBtn.exists()).toBe(true);
  });

  it('doit avoir la classe CSS "profile-btn"', () => {
    const profileBtn = wrapper.find('.profile-btn');
    
    expect(profileBtn.classes()).toContain('profile-btn');
  });

  it('doit afficher l\'icône de profil', () => {
    const icon = wrapper.find('.icon-color');
    
    expect(icon.exists()).toBe(true);
    
    expect(icon.classes()).toContain('icon-color');
  });
});

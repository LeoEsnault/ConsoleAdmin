// exécuter commande dans le terminal du back : node seed/seed_1.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

const seedDatabase = async () => {
    try {
        const { data: user, error: userError } = await supabase.auth.admin.createUser({
            email: 'super_admin@example.com',
            password: 'Admin123!',
            email_confirm: true,
        });

        if (userError) throw userError;
        console.log('Utilisateur créé:', user);

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert([{ user_id: user.user.id, firstname: 'Admin', lastname: 'Super' }]).select()
            .single();;

        if (profileError) throw profileError;
        console.log('Profil ajouté:', profile);

        const { data: role, error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: user.user.id, role: 'super_admin' }]).select()
            .single();

        if (roleError) throw roleError;
        console.log('Rôle ajouté:', role);

        console.log('✅ Initialisation terminée avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l’initialisation:', error.message);
    }
};

seedDatabase();

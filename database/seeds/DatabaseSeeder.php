<?php


use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        $users = array(
            [
                'username' => 'user1',
                'firstName' => 'Marcos J.',
                'lastName' => 'Alvarez M.',
                'identityNumber' => '1090419420',
                'active' => true,
                'password' => Hash::make('123456')
            ]
        );

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        Model::reguard();
    }
}

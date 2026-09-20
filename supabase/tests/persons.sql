begin;
select plan(14);
select has_table('public', 'persons', 'La tabla persons existe');
select col_not_null(
        'public',
        'persons',
        'name',
        'El nombre es obligatorio'
    );
select col_not_null(
        'public',
        'persons',
        'email',
        'El correo es obligatorio'
    );
select col_type_is(
        'public',
        'persons',
        'phone',
        'character varying(10)',
        'El telefono es varchar(10)'
    );
select is(
        (
            select relrowsecurity
            from pg_class
            where oid = 'public.persons'::regclass
        ),
        true,
        'RLS esta habilitado'
    );
select is(
        (
            select count(*)
            from pg_policies
            where schemaname = 'public'
                and tablename = 'persons'
        ),
        4::bigint,
        'Existen cuatro politicas autenticadas'
    );
set local role authenticated;
select lives_ok(
        $$insert into public.persons (name, email, phone, role)
        values (
                'Smoke Test',
                'smoke-test@local.test',
                '5512345678',
                'QA'
            ) $$,
            'authenticated puede crear personas'
    );
select is(
        (
            select count(*)
            from public.persons
            where email = 'smoke-test@local.test'
        ),
        1::bigint,
        'authenticated puede leer personas'
    );
select lives_ok(
        $$update public.persons
        set name = 'Smoke Updated'
        where email = 'smoke-test@local.test' $$,
            'authenticated puede actualizar personas'
    );
select is(
        (
            select name
            from public.persons
            where email = 'smoke-test@local.test'
        ),
        'Smoke Updated',
        'authenticated ve la actualizacion'
    );
select lives_ok(
        $$delete
        from public.persons
        where email = 'smoke-test@local.test' $$,
            'authenticated puede eliminar personas'
    );
select is(
        (
            select count(*)
            from public.persons
            where email = 'smoke-test@local.test'
        ),
        0::bigint,
        'authenticated ve el borrado'
    );
set local role anon;
select is(
        (
            select count(*)
            from public.persons
        ),
        0::bigint,
        'anon no puede leer personas'
    );
select throws_ok(
        $$insert into public.persons (name, email, phone)
        values (
                'Anonymous',
                'anonymous@local.test',
                '5511111111'
            ) $$,
            '42501',
            'new row violates row-level security policy for table "persons"',
            'anon no puede crear personas'
    );
select *
from finish();
rollback;
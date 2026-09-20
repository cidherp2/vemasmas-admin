begin;
select plan(6);
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
        'character varying',
        'El telefono es varchar'
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
select *
from finish();
rollback;
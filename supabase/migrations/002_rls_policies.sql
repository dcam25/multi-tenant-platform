-- RLS policies for tenant isolation
-- Per article: Row-Level Security provides automated WHERE conditions
-- Uses app.current_user_id and app.current_tenant_id set by application per request

CREATE SCHEMA IF NOT EXISTS app;

-- Helper: get current user from session (set by backend before queries)
CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::TEXT;
$$ LANGUAGE SQL STABLE;

-- Helper: get current tenant from session
CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

-- Tenants: users can see tenants they are members of
CREATE POLICY tenant_select_policy ON tenants
  FOR SELECT
  USING (
    id IN (
      SELECT tu.tenant_id FROM tenant_users tu
      WHERE tu.user_id = app.current_user_id()
    )
  );

-- Service role bypasses RLS; these policies apply when using anon/user-scoped connections

-- Tenant users: users can see their own memberships
CREATE POLICY tenant_users_select_policy ON tenant_users
  FOR SELECT
  USING (user_id = app.current_user_id());

-- Tenant config: users can see config for tenants they belong to
CREATE POLICY tenant_config_select_policy ON tenant_config
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tu.tenant_id FROM tenant_users tu
      WHERE tu.user_id = app.current_user_id()
    )
  );

-- Tenant data: users can see data for tenants they belong to
CREATE POLICY tenant_data_select_policy ON tenant_data
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tu.tenant_id FROM tenant_users tu
      WHERE tu.user_id = app.current_user_id()
    )
  );

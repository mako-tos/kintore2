-- サービスロールのみがCRUD可能なポリシーを設定
CREATE POLICY "Enable full access for service role" ON body_compositions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

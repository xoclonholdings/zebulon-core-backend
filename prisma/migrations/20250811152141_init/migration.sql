-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "public"."ZuluTask" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZuluTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Column" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigneeId" TEXT,
    "statusColId" TEXT,
    "dueAt" TIMESTAMP(3),
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Meeting" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "roomCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recording" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotePage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Folder" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "refId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ZuluRun" (
    "id" TEXT NOT NULL,
    "taskKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "meta" JSONB,
    "logs" JSONB,

    CONSTRAINT "ZuluRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "profile_image_url" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR NOT NULL,
    "title" TEXT NOT NULL,
    "preview" TEXT,
    "model" TEXT NOT NULL DEFAULT 'gpt-4o',
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT NOT NULL DEFAULT 'chat',

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" VARCHAR NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."files" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" VARCHAR,
    "file_name" TEXT,
    "original_name" TEXT,
    "mime_type" TEXT,
    "size" INTEGER,
    "status" TEXT DEFAULT 'processing',
    "extracted_content" TEXT,
    "analysis" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT,
    "folderId" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_memory" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "admin_only" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_memory" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'context',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scratchpad_memory" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR NOT NULL,
    "conversation_id" VARCHAR,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scratchpad_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "sid" VARCHAR NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "public"."analytics" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_data" JSONB,
    "session_id" VARCHAR,
    "conversation_id" VARCHAR,
    "duration" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cache_storage" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "cache_key" VARCHAR NOT NULL,
    "cache_value" JSONB NOT NULL,
    "expiration" TIMESTAMP(6),
    "tags" TEXT[],
    "size" BIGINT NOT NULL,
    "hit_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cache_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_sessions" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "duration" INTEGER DEFAULT 0,
    "messages_used" INTEGER DEFAULT 0,
    "memory_usage" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interaction_log" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interaction_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_storage" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "file_id" VARCHAR NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "chunk_data" TEXT NOT NULL,
    "chunk_size" BIGINT NOT NULL,
    "checksum" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowledge_base" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "category" TEXT NOT NULL,
    "is_public" BOOLEAN DEFAULT false,
    "version" INTEGER DEFAULT 1,
    "parent_id" VARCHAR,
    "usage_count" INTEGER DEFAULT 0,
    "rating" REAL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memory_index" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" VARCHAR NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_id" VARCHAR NOT NULL,
    "embedding" REAL[],
    "keywords" TEXT[],
    "summary" TEXT,
    "importance" REAL DEFAULT 0.5,
    "access_count" INTEGER DEFAULT 0,
    "last_accessed" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_index_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZuluTask_key_key" ON "public"."ZuluTask"("key");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "public"."WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_roomCode_key" ON "public"."Meeting"("roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "NotePage_slug_key" ON "public"."NotePage"("slug");

-- CreateIndex
CREATE INDEX "ZuluRun_taskKey_idx" ON "public"."ZuluRun"("taskKey");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "core_memory_key_unique" ON "public"."core_memory"("key");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "public"."sessions"("expire");

-- CreateIndex
CREATE INDEX "idx_analytics_created_at" ON "public"."analytics"("created_at");

-- CreateIndex
CREATE INDEX "idx_analytics_event_type" ON "public"."analytics"("event_type");

-- CreateIndex
CREATE INDEX "idx_analytics_session_id" ON "public"."analytics"("session_id");

-- CreateIndex
CREATE INDEX "idx_analytics_user_id" ON "public"."analytics"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cache_storage_cache_key_unique" ON "public"."cache_storage"("cache_key");

-- CreateIndex
CREATE INDEX "idx_cache_expiration" ON "public"."cache_storage"("expiration");

-- CreateIndex
CREATE INDEX "idx_cache_key" ON "public"."cache_storage"("cache_key");

-- CreateIndex
CREATE INDEX "idx_cache_tags" ON "public"."cache_storage"("tags");

-- CreateIndex
CREATE INDEX "idx_interaction_log_user_id" ON "public"."interaction_log"("user_id");

-- CreateIndex
CREATE INDEX "idx_interaction_log_timestamp" ON "public"."interaction_log"("timestamp");

-- CreateIndex
CREATE INDEX "idx_file_storage_chunk_index" ON "public"."file_storage"("chunk_index");

-- CreateIndex
CREATE INDEX "idx_file_storage_file_id" ON "public"."file_storage"("file_id");

-- CreateIndex
CREATE INDEX "idx_kb_category" ON "public"."knowledge_base"("category");

-- CreateIndex
CREATE INDEX "idx_kb_public" ON "public"."knowledge_base"("is_public");

-- CreateIndex
CREATE INDEX "idx_kb_tags" ON "public"."knowledge_base"("tags");

-- CreateIndex
CREATE INDEX "idx_kb_user_id" ON "public"."knowledge_base"("user_id");

-- CreateIndex
CREATE INDEX "idx_memory_content_type" ON "public"."memory_index"("content_type");

-- CreateIndex
CREATE INDEX "idx_memory_conv_id" ON "public"."memory_index"("conversation_id");

-- CreateIndex
CREATE INDEX "idx_memory_importance" ON "public"."memory_index"("importance");

-- CreateIndex
CREATE INDEX "idx_memory_last_accessed" ON "public"."memory_index"("last_accessed");

-- AddForeignKey
ALTER TABLE "public"."WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Column" ADD CONSTRAINT "Column_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_statusColId_fkey" FOREIGN KEY ("statusColId") REFERENCES "public"."Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Meeting" ADD CONSTRAINT "Meeting_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recording" ADD CONSTRAINT "Recording_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "public"."Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotePage" ADD CONSTRAINT "NotePage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ZuluRun" ADD CONSTRAINT "ZuluRun_taskKey_fkey" FOREIGN KEY ("taskKey") REFERENCES "public"."ZuluTask"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_memory" ADD CONSTRAINT "project_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."scratchpad_memory" ADD CONSTRAINT "scratchpad_memory_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."scratchpad_memory" ADD CONSTRAINT "scratchpad_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."analytics" ADD CONSTRAINT "analytics_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chat_sessions" ADD CONSTRAINT "chat_sessions_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."interaction_log" ADD CONSTRAINT "interaction_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."file_storage" ADD CONSTRAINT "file_storage_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."knowledge_base" ADD CONSTRAINT "knowledge_base_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."memory_index" ADD CONSTRAINT "memory_index_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

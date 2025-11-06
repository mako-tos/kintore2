# Implementation Tasks: トレーニングメニュー登録画面とトレーニング記録登録画面

**Feature**: 1-training-menu-record-form
**Created**: 2025-11-07
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Overview

This document breaks down the implementation into executable tasks organized by user story. Each phase represents an independently testable increment.

**Total Tasks**: 18
**User Stories**: 2 (US1: メニュー登録, US2: 記録登録)
**Parallel Opportunities**: 8 tasks can run in parallel within phases

## Implementation Strategy

- **MVP Scope**: User Story 1 (メニュー登録) - delivers immediate value
- **Incremental Delivery**: Each user story is independently testable
- **Tech Stack**: Next.js, TypeScript, React, Pure.css, Supabase

---

## Phase 1: Setup & Infrastructure

**Goal**: Initialize project structure and shared components

### Tasks

- [ ] T001 Verify Supabase tables exist (training_menus, training_records per specs/1-server-basic/data-model.md)
- [ ] T002 [P] Create shared types in src/types/form-validation.ts for validation errors
- [ ] T003 [P] Create shared validation utilities in src/utils/validation.ts (name max 20 chars, required fields)
- [ ] T004 [P] Create error display component in src/components/ErrorMessage.tsx with Pure.css styling

---

## Phase 2: Foundational Components

**Goal**: Build blocking prerequisites needed by all user stories

### Tasks

- [ ] T005 Create API client wrapper in src/lib/api-client.ts for error handling
- [ ] T006 [P] Create loading state component in src/components/LoadingSpinner.tsx
- [ ] T007 [P] Create success notification component in src/components/SuccessMessage.tsx

---

## Phase 3: User Story 1 - トレーニングメニュー登録

**Story Goal**: ユーザーは新しいトレーニングメニューを登録できる

**Independent Test Criteria**:
- メニュー名入力→登録ボタン押下→一覧に追加される
- 空のメニュー名でエラー表示
- 重複メニュー名でエラー表示
- キャンセルボタンで一覧に戻る

### Tasks

- [ ] T008 [US1] Create menu form component in src/components/TrainingMenuForm.tsx with name input, submit/cancel buttons
- [ ] T009 [US1] Implement client-side validation in src/components/TrainingMenuForm.tsx (required, max 20 chars)
- [ ] T010 [US1] Add duplicate check logic in src/components/TrainingMenuForm.tsx using existing API
- [ ] T011 [US1] Create menu registration page in src/pages/training-menus/new.tsx
- [ ] T012 [US1] Implement form submission handler calling POST /api/training-menus in src/components/TrainingMenuForm.tsx
- [ ] T013 [US1] Add success redirect to list page in src/components/TrainingMenuForm.tsx
- [ ] T014 [US1] Add error display integration in src/components/TrainingMenuForm.tsx using ErrorMessage component

**Completion Checklist**:
- [ ] Form renders with all required fields
- [ ] Validation triggers on submit
- [ ] Duplicate names rejected
- [ ] Success redirects to list
- [ ] Errors display clearly

---

## Phase 4: User Story 2 - トレーニング記録登録

**Story Goal**: ユーザーは日々のトレーニングをタイマー付きで記録できる

**Independent Test Criteria**:
- メニュー選択→スタートボタン→タイマー起動・回数1
- スタートボタン複数回押下→回数増加
- ストップボタン→タイマー停止
- メニュー変更→自動保存・ログ表示更新
- 当日記録がログ表示に反映

### Tasks

- [ ] T015 [US2] Create training record form state in src/hooks/useTrainingRecordForm.ts (menuId, count, timer, isRunning)
- [ ] T016 [US2] Implement timer logic in src/hooks/useTimer.ts (start, stop, reset, elapsed time)
- [ ] T017 [US2] Create record form UI in src/components/TrainingRecordForm.tsx (menu select, timer display, count display, start/stop buttons)
- [ ] T018 [US2] Implement start button handler in src/components/TrainingRecordForm.tsx (increment count, disable menu, enable stop)
- [ ] T019 [US2] Implement stop button handler in src/components/TrainingRecordForm.tsx (stop timer, enable menu/start, disable stop)
- [ ] T020 [US2] Implement menu change handler in src/components/TrainingRecordForm.tsx (save if count>0, reset state)
- [ ] T021 [US2] Create log display component in src/components/TrainingRecordLog.tsx showing today's records
- [ ] T022 [US2] Create record registration page in src/pages/training-records/new.tsx
- [ ] T023 [US2] Implement auto-save to API POST /api/training-records in src/components/TrainingRecordForm.tsx
- [ ] T024 [US2] Add error handling for save failures in src/components/TrainingRecordForm.tsx

**Completion Checklist**:
- [ ] Timer starts/stops correctly
- [ ] Count increments on each start
- [ ] Menu change triggers auto-save
- [ ] Log displays today's records
- [ ] Errors handled gracefully

---

## Phase 5: Polish & Cross-Cutting Concerns

**Goal**: Finalize UI, performance, and error handling

### Tasks

- [ ] T025 [P] Add Pure.css styling refinements to all form components
- [ ] T026 [P] Optimize API calls to meet 3-second performance target
- [ ] T027 Add loading states during API calls in both form components
- [ ] T028 [P] Add comprehensive error logging to external service per plan.md
- [ ] T029 Test cross-browser compatibility (PC/mobile per spec.md)

---

## Dependencies & Execution Order

### Story Dependencies
- **US1** (メニュー登録): Independent - can start immediately after Phase 2
- **US2** (記録登録): Depends on US1 (needs menu list API)

### Parallel Execution Opportunities

**Phase 1** (all parallel after T001):
```
T001 → [T002, T003, T004]
```

**Phase 2** (all parallel):
```
[T006, T007] (T005 blocks nothing)
```

**Phase 3** (US1):
```
T008 → T009 → T010 → T011 → [T012, T013, T014]
```

**Phase 4** (US2):
```
[T015, T016] → T017 → [T018, T019, T020] → T021 → T022 → [T023, T024]
```

**Phase 5**:
```
[T025, T026, T028] → T027 → T029
```

---

## Testing Strategy

### Unit Tests (per plan.md)
- Validation utilities (T003)
- Timer hook (T016)
- Form state management (T015)

### Integration Tests (per plan.md)
- API calls with Supabase (T012, T023)
- Form submission flows (T008-T014, T017-T024)

### E2E Tests (per plan.md)
- Full user journey for US1 (menu registration)
- Full user journey for US2 (record with timer)

### Performance Tests
- Verify 3-second registration target (T026)

---

## MVP Recommendation

**Suggested MVP**: Complete Phase 1-3 (User Story 1 only)
- Delivers core menu registration functionality
- 14 tasks total
- Can ship independently
- User Story 2 can follow in next iteration

**Benefits**:
- Faster time to value
- Reduced risk
- User feedback on US1 before building US2
- Clear incremental progress

---

## Notes

- All tasks include specific file paths for LLM execution
- Each user story is independently testable
- Dependencies clearly marked
- Parallel opportunities identified for faster execution
- No tests explicitly requested in spec.md, but plan.md mentions test types for reference

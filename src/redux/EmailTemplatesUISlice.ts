import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { EmailTemplate } from "@/redux/@types/EmailTemplates";

export type BuilderOrRawMode = "builder" | "raw_html";
export type PreviewDeviceMode = "desktop" | "mobile";
export type PreviewTheme = "light" | "dark";

interface EmailTemplatesUIState {
	activeTemplateId: string | null;
	draftTemplate: EmailTemplate | null;
	hasUnsavedChanges: boolean;
	mode: BuilderOrRawMode;
	previewDevice: PreviewDeviceMode;
	previewTheme: PreviewTheme;
	sampleData: Record<string, unknown>;
}

const initialState: EmailTemplatesUIState = {
	activeTemplateId: null,
	draftTemplate: null,
	hasUnsavedChanges: false,
	mode: "builder",
	previewDevice: "desktop",
	previewTheme: "light",
	sampleData: {}
};

export const emailTemplatesUISlice = createSlice({
	name: "emailTemplatesUI",
	initialState,
	reducers: {
		setActiveTemplateId: (state, action: PayloadAction<string | null>) => {
			state.activeTemplateId = action.payload;
		},
		setDraftTemplate: (state, action: PayloadAction<EmailTemplate | null>) => {
			state.draftTemplate = action.payload;
			state.hasUnsavedChanges = !!action.payload;
		},
		markSaved: state => {
			state.hasUnsavedChanges = false;
		},
		setMode: (state, action: PayloadAction<BuilderOrRawMode>) => {
			state.mode = action.payload;
			state.hasUnsavedChanges = true;
		},
		setPreviewDevice: (state, action: PayloadAction<PreviewDeviceMode>) => {
			state.previewDevice = action.payload;
		},
		setPreviewTheme: (state, action: PayloadAction<PreviewTheme>) => {
			state.previewTheme = action.payload;
		},
		setSampleData: (state, action: PayloadAction<Record<string, unknown>>) => {
			state.sampleData = action.payload;
		},
		resetEmailTemplatesUI: () => initialState
	}
});

export const {
	setActiveTemplateId,
	setDraftTemplate,
	markSaved,
	setMode,
	setPreviewDevice,
	setPreviewTheme,
	setSampleData,
	resetEmailTemplatesUI
} = emailTemplatesUISlice.actions;

export const emailTemplatesUIReducer = emailTemplatesUISlice.reducer;


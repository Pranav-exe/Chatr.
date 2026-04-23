{{/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                         _helpers.tpl                                       ║
║                                                                            ║
║  This file starts with "_" so Helm knows it's NOT a Kubernetes manifest.   ║
║  It contains reusable template "functions" (called named templates).       ║
║                                                                            ║
║  HOW IT WORKS:                                                             ║
║  1. You DEFINE a named template here:  {{- define "chatr.labels" }}        ║
║  2. You USE it in other templates:     {{- include "chatr.labels" . }}     ║
║                                                                            ║
║  WHY:                                                                      ║
║  Instead of copy-pasting the same labels into all 12 files,                ║
║  you define them ONCE here and include them everywhere.                    ║
║  Change it here → changes everywhere automatically.                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/}}


{{/*
──────────────────────────────────────────────────────────────────────────────
CHART NAME
Returns the chart name, or the nameOverride if set.
Usage: {{ include "chatr.name" . }}
Result: "chatr-chart"
──────────────────────────────────────────────────────────────────────────────
*/}}
{{- define "chatr.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
──────────────────────────────────────────────────────────────────────────────
FULLNAME
Creates a unique name combining release name + chart name.
This prevents conflicts if you install the same chart multiple times.
Usage: {{ include "chatr.fullname" . }}
Result: "my-release-chatr-chart" (or just "my-release" if names match)
──────────────────────────────────────────────────────────────────────────────
*/}}
{{- define "chatr.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}


{{/*
──────────────────────────────────────────────────────────────────────────────
COMMON LABELS
These labels go on EVERY resource (Deployments, Services, ConfigMaps, etc.)
They help you identify which chart and release created each resource.

Usage in templates:
  metadata:
    labels:
      {{- include "chatr.labels" . | nindent 6 }}

Result:
  metadata:
    labels:
      helm.sh/chart: chatr-chart-0.1.0
      app.kubernetes.io/managed-by: Helm
      app.kubernetes.io/version: v1
──────────────────────────────────────────────────────────────────────────────
*/}}
{{- define "chatr.labels" -}}
helm.sh/chart: {{ include "chatr.name" . }}-{{ .Chart.Version }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end }}


{{/*
──────────────────────────────────────────────────────────────────────────────
COMPONENT LABELS
Per-service labels. Pass the component name as the second argument.
These are used in Deployment metadata and Service selectors.

Usage:
  metadata:
    labels:
      {{- include "chatr.componentLabels" (dict "component" "backend" "context" .) | nindent 6 }}

Result:
  metadata:
    labels:
      app: backend
      app.kubernetes.io/component: backend
      helm.sh/chart: chatr-chart-0.1.0
      app.kubernetes.io/managed-by: Helm
──────────────────────────────────────────────────────────────────────────────
*/}}
{{- define "chatr.componentLabels" -}}
app: {{ .component }}
app.kubernetes.io/component: {{ .component }}
{{- include "chatr.labels" .context | nindent 0 }}
{{- end }}


{{/*
──────────────────────────────────────────────────────────────────────────────
SELECTOR LABELS
Minimal labels used in spec.selector.matchLabels and spec.template.metadata.labels.
These MUST be the same in both places for Kubernetes to match pods to deployments.

Usage:
  spec:
    selector:
      matchLabels:
        {{- include "chatr.selectorLabels" "backend" | nindent 8 }}

Result:
  spec:
    selector:
      matchLabels:
        app: backend
──────────────────────────────────────────────────────────────────────────────
*/}}
{{- define "chatr.selectorLabels" -}}
app: {{ . }}
{{- end }}


{{/*
──────────────────────────────────────────────────────────────────────────────
IMAGE BUILDER
Constructs the full image path from registry + repository + tag.
Custom images use the global registry; public images (mongo, redis) don't.

Usage:
  For custom images (backend, nginx):
    image: {{ include "chatr.image" (dict "registry" .Values.global.imageRegistry "repo" .Values.backend.image.repository "tag" (default .Chart.AppVersion .Values.backend.image.tag)) }}
  
  For public images (mongo, redis):
    image: {{ .Values.mongodb.image.repository }}:{{ .Values.mongodb.image.tag }}
──────────────────────────────────────────────────────────────────────────────
*/}}
{{- define "chatr.image" -}}
{{- if .registry -}}
{{ .registry }}/{{ .repo }}:{{ .tag }}
{{- else -}}
{{ .repo }}:{{ .tag }}
{{- end -}}
{{- end }}

<script lang="ts">
	import {
		Database,
		Users,
		CheckSquare,
		FileText,
		Folder,
		HardDrive,
		Mail,
		Cpu,
		Settings,
		LogOut,
		Sun,
		Moon,
		Search,
		Plus,
		Trash2,
		SquarePen,
		ChevronLeft,
		ChevronRight,
		ArrowUpDown,
		Filter,
		X,
		Check,
		ExternalLink,
		Box,
		LayoutDashboard,
		Layers,
		ShieldCheck,
		Activity,
		RefreshCw,
		UploadCloud
	} from '@lucide/svelte';

	let { name, class: className = 'w-4 h-4' }: { name?: string; class?: string } = $props();

	const iconMap: Record<string, any> = {
		Database,
		Users,
		CheckSquare,
		FileText,
		Folder,
		HardDrive,
		Mail,
		Cpu,
		Settings,
		LogOut,
		Sun,
		Moon,
		Search,
		Plus,
		Trash2,
		SquarePen,
		Edit: SquarePen,
		ChevronLeft,
		ChevronRight,
		ArrowUpDown,
		Filter,
		X,
		Check,
		ExternalLink,
		Box,
		LayoutDashboard,
		Layers,
		ShieldCheck,
		Activity,
		RefreshCw,
		UploadCloud
	};

	const IconComponent = $derived(iconMap[name || 'Database'] || Database);
</script>

<IconComponent class={className} />

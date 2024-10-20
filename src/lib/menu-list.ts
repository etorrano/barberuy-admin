import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";

export type Submenu = {
  href: string;
  label: string;
  active?: boolean | undefined;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Panel",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Agenda",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contenido",
      menus: [
        {
          href: "",
          label: "Punto de Venta",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Ver listado",
            },
            {
              href: "/posts/new",
              label: "Nuevo",
            },
          ],
        },
        {
          href: "",
          label: "Turno",
          icon: SquarePen,
          submenus: [
            {
              href: "/turnos",
              label: "Ver listado",
            },
            {
              href: "/turnos/nuevo",
              label: "Nuevo",
            },
          ],
        },

        {
          href: "",
          label: "Servicio",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Ver listado",
            },
            {
              href: "/posts/new",
              label: "Nuevo",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "",
          label: "Usuarios",
          icon: Users,
          submenus: [
            {
              href: "/usuarios",
              label: "Ver listado",
            },
            {
              href: "/usuarios/nuevo",
              label: "Nuevo",
            },
          ],
        },
        {
          href: "/account",
          label: "Mi cuenta",
          icon: Settings,
        },
      ],
    },
  ];
}

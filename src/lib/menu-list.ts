import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
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
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Agenda",
          icon: LayoutGrid,
          submenus: []
        }
      ]
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
              label: "Ver listado"
            },
            {
              href: "/posts/new",
              label: "Nuevo"
            }
          ]
        },        
        {
          href: "",
          label: "Turno",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Ver listado"
            },
            {
              href: "/posts/new",
              label: "Nuevo"
            }
          ]
        },
        
        {
          href: "",
          label: "Servicio",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Ver listado"
            },
            {
              href: "/posts/new",
              label: "Nuevo"
            }
          ]
        },
      ]
    },
    {
      groupLabel: "Configuración",
      menus: [
        {
          href: "/users",
          label: "Usuarios",
          icon: Users
        },
        {
          href: "/account",
          label: "Mi cuenta",
          icon: Settings
        }
      ]
    }
  ];
}

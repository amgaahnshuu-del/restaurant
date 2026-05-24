"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Children,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

type RouteElementProps = {
  path?: string;
  element?: ReactElement | null;
};

type CompatLocation = {
  pathname: string;
  search: string;
  hash: string;
  key: string;
  state: null;
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  to: string;
  replace?: boolean;
  className?: string;
};

export type NavLinkProps = Omit<LinkProps, "className"> & {
  className?: string | ((state: { isActive: boolean; isPending: boolean }) => string);
};

const normalizePath = (value: string) => {
  if (!value || value === "/") {
    return "/";
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const useCompatPathname = () => normalizePath(usePathname() || "/");

export const BrowserRouter = ({ children }: { children: ReactNode }) => <>{children}</>;

export const Route = ({ element }: RouteElementProps) => element ?? null;

export const Routes = ({
  children,
  location,
}: {
  children: ReactNode;
  location?: Pick<CompatLocation, "pathname">;
}) => {
  const compatPathname = useCompatPathname();
  const pathname = normalizePath(location?.pathname || compatPathname);
  let fallback: ReactElement | null = null;

  for (const child of Children.toArray(children)) {
    if (!isValidElement<RouteElementProps>(child)) {
      continue;
    }

    const routePath = child.props.path;

    if (routePath === "*") {
      fallback = child.props.element ?? null;
      continue;
    }

    if (normalizePath(routePath || "/") === pathname) {
      return child.props.element ?? null;
    }
  }

  return fallback;
};

export const useLocation = (): CompatLocation => {
  const pathname = useCompatPathname();

  return {
    pathname,
    search: "",
    hash: "",
    key: pathname,
    state: null,
  };
};

export const useNavigate = () => {
  const router = useRouter();

  return (to: string) => {
    router.push(to);
  };
};

export const LinkCompat = forwardRef<HTMLAnchorElement, LinkProps>(function LinkCompat(
  { to, replace, children, ...props },
  ref,
) {
  return (
    <NextLink href={to} replace={replace} ref={ref as never} {...props}>
      {children}
    </NextLink>
  );
});

export { LinkCompat as Link };

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, children, ...props },
  ref,
) {
  const pathname = useCompatPathname();
  const isActive = pathname === normalizePath(to);
  const resolvedClassName =
    typeof className === "function" ? className({ isActive, isPending: false }) : className;

  return (
    <LinkCompat ref={ref} to={to} className={resolvedClassName} {...props}>
      {children}
    </LinkCompat>
  );
});

export type NavLinkState = {
  isActive: boolean;
  isPending: boolean;
};

export const Outlet = () => null;

export const Navigate = ({ to }: { to: string }) => {
  const router = useRouter();
  router.push(to);
  return null;
};

export const createSearchParams = (params: Record<string, string>) => new URLSearchParams(params);

export const redirect = (to: string) => {
  if (typeof window !== "undefined") {
    window.location.href = to;
  }
};

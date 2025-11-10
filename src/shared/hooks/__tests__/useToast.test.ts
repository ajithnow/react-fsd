import { renderHook, act } from "@testing-library/react"
import { useToast } from "../useToast"
import { toast } from "sonner"

jest.mock("sonner", () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    message: jest.fn()
  })
}))

const mockToast = toast as jest.MockedFunction<typeof toast> & {
  success: jest.MockedFunction<typeof toast.success>;
  error: jest.MockedFunction<typeof toast.error>;
  warning: jest.MockedFunction<typeof toast.warning>;
  info: jest.MockedFunction<typeof toast.info>;
  message: jest.MockedFunction<typeof toast.message>;
};

describe("useToast", () => {
  beforeEach(() => {
    mockToast.mockClear()
    mockToast.success.mockClear()
    mockToast.error.mockClear()
    mockToast.warning.mockClear()
    mockToast.info.mockClear()
    mockToast.message.mockClear()
  })

  it("should expose the notify function", () => {
    const { result } = renderHook(() => useToast())
    expect(typeof result.current.notify).toBe("function")
  })

  it("should call toast.message with default options", () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.notify("Test message")
    })
    expect(mockToast.message).toHaveBeenCalledWith("Test message", {
      duration: 1000,
      closeButton: true,
      richColors: true,
      position: 'top-right'
    })
  })

  it("should call toast.success when type is success", () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.notify("Success message", undefined, "success")
    })
    expect(mockToast.success).toHaveBeenCalledWith("Success message", {
      duration: 1000,
      closeButton: true,
      richColors: true,
      position: 'top-right'
    })
  })

  it("should merge custom options with defaults", () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.notify("Test message", { duration: 2000 })
    })
    expect(mockToast.message).toHaveBeenCalledWith("Test message", {
      duration: 2000,
      closeButton: true,
      richColors: true,
      position: 'top-right'
    })
  })
})